"""Sentiment Analysis Processor - loads SVM model and processes feedback"""
import os
import joblib
import re
from pathlib import Path

# Load the two-stage cascading SVM model: vectorizer and two classifiers
MODELS_DIR = Path(__file__).parent / 'models'
VECTORIZER_PATH = MODELS_DIR / 'svm_model.joblib'
STAGE1_CLASSIFIER_PATH = MODELS_DIR / 'model_stage1.joblib'
STAGE2_CLASSIFIER_PATH = MODELS_DIR / 'model_stage2.joblib'

vectorizer = None
classifier_stage1 = None
classifier_stage2 = None
MODEL_LOADED = False

try:
    vectorizer = joblib.load(VECTORIZER_PATH)
    classifier_stage1 = joblib.load(STAGE1_CLASSIFIER_PATH)
    classifier_stage2 = joblib.load(STAGE2_CLASSIFIER_PATH)
    MODEL_LOADED = True
    print("✓ Sentiment model loaded successfully (vectorizer + two-stage classifiers)")
except Exception as e:
    print(f"Error loading sentiment model: {e}")
    vectorizer = None
    classifier_stage1 = None
    classifier_stage2 = None
    MODEL_LOADED = False


def clean_text(text):
    """Clean and normalize text for sentiment analysis"""
    if not text:
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove special characters and extra whitespace
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text


def analyze_sentiment(feedback_text):
    """
    Analyze sentiment of feedback text using two-stage cascading SVM classifiers.
    
    Stage 1: Is it positive?
    Stage 2: If not positive, is it negative or neutral?
    
    Returns: {
        'sentiment': 'positive' | 'negative' | 'neutral',
        'confidence': float (0-1),
        'label': int (0=negative, 1=neutral, 2=positive)
    }
    """
    if not MODEL_LOADED or vectorizer is None or classifier_stage1 is None or classifier_stage2 is None:
        return {
            'sentiment': 'unknown',
            'confidence': 0.0,
            'label': -1,
            'error': 'Model not loaded'
        }
    
    try:
        cleaned_text = clean_text(feedback_text)
        
        if not cleaned_text:
            return {
                'sentiment': 'unknown',
                'confidence': 0.0,
                'label': -1,
                'error': 'Empty feedback after cleaning'
            }
        
        # Step 1: Vectorize the text
        vectorized_text = vectorizer.transform([cleaned_text])
        
        # Step 2a: Run Stage 1 classifier (Is it positive?)
        stage1_prediction = classifier_stage1.predict(vectorized_text)[0]
        
        # Try to get stage1 confidence
        try:
            stage1_scores = classifier_stage1.decision_function(vectorized_text)[0]
            import numpy as np
            stage1_confidence = 1.0 / (1.0 + np.exp(-abs(stage1_scores)))
        except:
            stage1_confidence = 1.0
        
        if stage1_prediction == 'positive':
            # Positive sentiment detected
            return {
                'sentiment': 'positive',
                'confidence': float(stage1_confidence) if not isinstance(stage1_confidence, np.ndarray) else float(np.max(stage1_confidence)),
                'label': 2
            }
        
        # Step 2b: If not positive, run Stage 2 (negative or neutral?)
        stage2_prediction = classifier_stage2.predict(vectorized_text)[0]
        
        # Try to get stage2 confidence
        try:
            stage2_scores = classifier_stage2.decision_function(vectorized_text)[0]
            import numpy as np
            stage2_confidence = 1.0 / (1.0 + np.exp(-abs(stage2_scores)))
            confidence = float(stage2_confidence) if not isinstance(stage2_confidence, np.ndarray) else float(np.max(stage2_confidence))
        except:
            confidence = 1.0
        
        # Map stage2 prediction to sentiment
        sentiment_map = {
            'negative': 'negative',
            'neutral': 'neutral'
        }
        sentiment = sentiment_map.get(stage2_prediction, 'unknown')
        
        # Map to numeric labels
        label_map = {
            'negative': 0,
            'neutral': 1
        }
        label = label_map.get(stage2_prediction, -1)
        
        return {
            'sentiment': sentiment,
            'confidence': confidence,
            'label': label
        }
        
    except Exception as e:
        return {
            'sentiment': 'error',
            'confidence': 0.0,
            'label': -1,
            'error': str(e)
        }


def get_model_status():
    """Check if sentiment model is loaded and ready"""
    return {
        'loaded': MODEL_LOADED,
        'vectorizer_path': str(VECTORIZER_PATH),
        'stage1_path': str(STAGE1_CLASSIFIER_PATH),
        'stage2_path': str(STAGE2_CLASSIFIER_PATH),
        'vectorizer_exists': VECTORIZER_PATH.exists(),
        'stage1_exists': STAGE1_CLASSIFIER_PATH.exists(),
        'stage2_exists': STAGE2_CLASSIFIER_PATH.exists()
    }
