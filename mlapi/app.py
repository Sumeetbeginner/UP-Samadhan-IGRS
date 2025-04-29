
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import requests
import torch
from huggingface_hub import InferenceClient
from paddleocr import PaddleOCR
import re
import io
import os
import uuid
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import cloudinary
import cloudinary.uploader
import cloudinary.api

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Cloudinary configuration
cloudinary.config(
    cloud_name='dxakdnlny',
    api_key='985554248217191',
    api_secret='9Y5hbPVTd5eW54DwQMZoc5c_3Ok'
)

# Initialize models
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
hf_client = InferenceClient(
    provider="nebius",
    api_key="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",
)
ocr_engine = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=True)

def upload_to_cloudinary(file_stream=None, url=None):
    """Upload image to Cloudinary from either file stream or URL"""
    try:
        if file_stream:
            # Reset stream position
            file_stream.seek(0)
            upload_result = cloudinary.uploader.upload(file_stream)
        elif url:
            upload_result = cloudinary.uploader.upload(url)
        else:
            return None
            
        return upload_result.get('secure_url')
    except Exception as e:
        print(f"Cloudinary upload error: {str(e)}")
        return None

@app.route('/predictAndDescribeImage', methods=['POST'])
def predict_and_describe_image():
    try:
        image = None
        image_url = None

        # Check image from file upload
        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
            
            # Convert to RGB and create a bytes buffer
            img = Image.open(file.stream).convert("RGB")
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='JPEG')
            img_bytes.seek(0)
            
            # Upload to Cloudinary
            image_url = upload_to_cloudinary(file_stream=img_bytes)
            if not image_url:
                return jsonify({'error': 'Failed to upload image to Cloudinary'}), 500
            
            # Reset for processing
            img_bytes.seek(0)
            image = Image.open(img_bytes)

        # Check image from URL
        elif request.is_json and 'image_url' in request.json:
            image_url = request.json['image_url']
            try:
                response = requests.get(image_url, stream=True)
                if response.status_code != 200:
                    return jsonify({'error': 'Invalid image URL'}), 400
                
                # Upload to Cloudinary for consistency
                cloudinary_url = upload_to_cloudinary(url=image_url)
                if cloudinary_url:
                    image_url = cloudinary_url
                
                image = Image.open(response.raw).convert("RGB")
            except Exception as e:
                return jsonify({'error': f'Error processing image URL: {str(e)}'}), 400
        else:
            return jsonify({'error': 'No image or image_url provided'}), 400

        # Categories
        text_descriptions = [
            "Fighting", "Uncleanliness", "Accident", "Traffic Jam", "Missing Document",
            "Power Outage", "Water Supply Issue", "Illegal Construction", "Corruption Complaint",
            "Garbage Dump", "Noise Pollution", "Public Harassment", "Stray Animals",
            "Street Light", "Road Damage/Potholes", "Tree Fallen", "Documents"
        ]

        # CLIP Prediction
        inputs = clip_processor(text=text_descriptions, images=image, return_tensors="pt", padding=True)
        outputs = clip_model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)

        predictions = [{
            "category": desc,
            "probability": float(prob.item() * 100)
        } for desc, prob in zip(text_descriptions, probs[0])]

        top_idx = probs[0].argmax().item()
        top_prediction = {
            "category": text_descriptions[top_idx],
            "probability": float(probs[0][top_idx].item() * 100)
        }

        # Image description using HF client
        img_bytes = io.BytesIO()
        image.save(img_bytes, format='JPEG')
        img_bytes.seek(0)

        description = hf_client.chat.completions.create(
            model="llava-hf/llava-1.5-7b-hf",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Describe this image in one sentence."},
                        {"type": "image_url", "image_url": {"url": image_url}}
                    ]
                }
            ],
            max_tokens=512,
        )

        description_text = description.choices[0].message.content

        return jsonify({
            "success": True,
            "predictions": predictions,
            "top_prediction": top_prediction,
            "description": description_text,
            "image_url": image_url  # This is now the Cloudinary URL
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ... [rest of your existing routes remain the same] ...




@app.route('/classifyTextComplaint', methods=['POST'])
def classify_text_complaint():
    try:
        data = request.get_json()
        text_complaint = data.get('text', '')
        
        if not text_complaint:
            return jsonify({'error': 'No text provided'}), 400
        
        categories = [
            "Fighting", "Uncleanliness", "Accident", "Missing Document",
            "Power Outage", "Water Supply Issue", "Illegal Construction", "Corruption Complaint",
            "Garbage Dump", "Noise Pollution", "Public Harassment", "Stray Animals",
            "Street Light", "Road Damage/Potholes", "Tree Fallen", "Documents"
        ]
        
        prompt = f"""Classify the following complaint strictly into one of these categories: 
        {', '.join(categories)}.
        
        Complaint: {text_complaint}
        
        Respond ONLY with the category name that best fits the complaint."""
        
        response = hf_client.chat.completions.create(
            model="llava-hf/llava-1.5-7b-hf",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ],
            max_tokens=50,
        )
        
        classification = response.choices[0].message.content.strip()
        
        # Validate the classification is one of our categories
        if classification not in categories:
            classification = "Other"
        
        return jsonify({
            "success": True,
            "classification": classification
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/ocr', methods=['POST'])
def ocr_processing():
    try:
        # Clean up old files before processing
        
        # Check if image is provided
        if 'image' not in request.files and 'image_url' not in request.json:
            return jsonify({'error': 'No image or image_url provided'}), 400
        
        image_url = None
        
        # Get image
        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
            if file and allowed_file(file.filename):
                # Save to temp folder and get URL
                temp_url = save_temp_image(file)
                image_url = f"http://{request.host}{temp_url}"
                img_path = os.path.join(app.config['UPLOAD_FOLDER'], temp_url.split('/')[-1])
        else:
            image_url = request.json.get('image_url')
            response = requests.get(image_url)
            filename = f"{uuid.uuid4().hex}.jpg"
            img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            with open(img_path, 'wb') as f:
                f.write(response.content)
        
        # Perform OCR
        result = ocr_engine.ocr(img_path, cls=True)
        
        # Extract all text
        extracted_text = []
        for line in result:
            for word in line:
                extracted_text.append(word[1][0])
        
        full_text = ' '.join(extracted_text)
        
        # Document type detection patterns
        doc_patterns = {
            'electricity_bill': r'(electricity|power|bill|kwh|kilowatt)',
            'fir': r'(f\.i\.r|first information report|police report)',
            'identity': r'(aadhaar|pan|voter id|passport|driving license)',
            'government': r'(government|govt|official|ministry|department)',
            'invoice': r'(invoice|bill|tax|amount|total|rs\.?)',
            'receipt': r'(receipt|paid|payment|received)',
            'certificate': r'(certificate|degree|diploma|award)'
        }
        
        # Detect document type
        doc_type = 'unknown'
        for type_name, pattern in doc_patterns.items():
            if re.search(pattern, full_text, re.IGNORECASE):
                doc_type = type_name
                break
        
        # Extract common fields based on document type
        extracted_fields = {}
        
        if doc_type == 'electricity_bill':
            # Extract common electricity bill fields
            amount = re.search(r'(total|amount|rs\.?)\s*[:=]?\s*(\d+\.\d{2})', full_text, re.IGNORECASE)
            if amount:
                extracted_fields['amount'] = amount.group(2)
            
            consumer_no = re.search(r'(consumer|account)\s*(no|number|#)?\s*[:=]?\s*(\d+)', full_text, re.IGNORECASE)
            if consumer_no:
                extracted_fields['consumer_number'] = consumer_no.group(3)
        
        elif doc_type == 'fir':
            # Extract FIR fields
            fir_no = re.search(r'(f\.i\.r|fir)\s*(no|number|#)?\s*[:=]?\s*(\d+)', full_text, re.IGNORECASE)
            if fir_no:
                extracted_fields['fir_number'] = fir_no.group(3)
            
            date = re.search(r'(date)\s*[:=]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})', full_text, re.IGNORECASE)
            if date:
                extracted_fields['date'] = date.group(2)
        
        elif doc_type == 'identity':
            # Extract ID fields
            id_no = re.search(r'(number|no|#)\s*[:=]?\s*([A-Z0-9]{8,12})', full_text, re.IGNORECASE)
            if id_no:
                extracted_fields['id_number'] = id_no.group(2)
            
            name = re.search(r'(name)\s*[:=]?\s*([A-Z][a-z]+\s[A-Z][a-z]+)', full_text)
            if name:
                extracted_fields['name'] = name.group(2)
        
        return jsonify({
            "success": True,
            "document_type": doc_type,
            "extracted_text": full_text,
            "extracted_fields": extracted_fields,
            "image_url": image_url  # Return the temp URL for reference
        })
        
    except Exception as e:
        # Clean up in case of error
        if 'img_path' in locals():
            try:
                os.remove(img_path)
            except:
                pass
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)