import joblib
import warnings
warnings.filterwarnings('ignore')

model = joblib.load('sentiment/models/svm_model.pkl')
print('Model type:', type(model))
print('Model:', model)

# Try to use it
try:
    result = model.predict(['This is great'])
    print('\n✓ Model can make predictions')
    print('Prediction result:', result)
except Exception as e:
    print(f'\n✗ Error: {e}')
    import traceback
    traceback.print_exc()
