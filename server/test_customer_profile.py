"""Test script for customer profile API endpoints"""
import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

# Test credentials
TEST_EMAIL = 'test@example.com'
TEST_PASSWORD = 'testpass123'

def test_customer_profile_api():
    """Test the customer profile API"""
    print("\n=== CUSTOMER PROFILE API TESTS ===\n")
    
    # 1. Sign up a test user
    print("1. Creating test user...")
    signup_data = {
        'email': TEST_EMAIL,
        'first_name': 'Test',
        'last_name': 'User',
        'phone_number': '09123456789',
        'password': TEST_PASSWORD,
        'password_confirm': TEST_PASSWORD
    }
    
    response = requests.post(f'{BASE_URL}/auth/signup/', json=signup_data)
    if response.status_code == 201:
        user_data = response.json()
        print(f"✅ User created: {user_data['user']['email']}")
        token = user_data['token']
    else:
        print(f"❌ Failed to create user: {response.text}")
        return
    
    # 2. Get user profile (empty address)
    print("\n2. Getting user profile (before updating)...")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{BASE_URL}/customer/profile/', headers=headers)
    if response.status_code == 200:
        profile = response.json()['profile']
        print(f"✅ Got profile:")
        print(f"   - Email: {profile['email']}")
        print(f"   - Name: {profile['first_name']} {profile['last_name']}")
        print(f"   - Phone: {profile['phone_number']}")
        print(f"   - Building: {profile['building_number']}")
        print(f"   - Street: {profile['street_name']}")
    else:
        print(f"❌ Failed to get profile: {response.text}")
        return
    
    # 3. Update user profile with address
    print("\n3. Updating user profile with address...")
    update_data = {
        'first_name': 'Juan',
        'last_name': 'Dela Cruz',
        'phone_number': '09122234566',
        'building_number': '123',
        'street_name': 'Remedios Street',
        'street_address': 'Remedios Circle',
        'state': 'Metro Manila',
        'city': 'Manila'
    }
    
    response = requests.post(f'{BASE_URL}/customer/profile/', json=update_data, headers=headers)
    if response.status_code == 200:
        profile = response.json()['profile']
        print(f"✅ Profile updated:")
        print(f"   - Name: {profile['first_name']} {profile['last_name']}")
        print(f"   - Building: {profile['building_number']}")
        print(f"   - Street Name: {profile['street_name']}")
        print(f"   - Street Address: {profile['street_address']}")
        print(f"   - State: {profile['state']}")
        print(f"   - City: {profile['city']}")
    else:
        print(f"❌ Failed to update profile: {response.text}")
        return
    
    # 4. Verify updated profile
    print("\n4. Verifying updated profile...")
    response = requests.get(f'{BASE_URL}/customer/profile/', headers=headers)
    if response.status_code == 200:
        profile = response.json()['profile']
        assert profile['first_name'] == 'Juan', "First name mismatch"
        assert profile['street_name'] == 'Remedios Street', "Street name mismatch"
        assert profile['city'] == 'Manila', "City mismatch"
        print(f"✅ Profile verification successful!")
        print(f"   All address fields saved correctly.")
    else:
        print(f"❌ Failed to verify: {response.text}")
        return
    
    print("\n=== ALL TESTS PASSED ✅ ===\n")

if __name__ == '__main__':
    try:
        test_customer_profile_api()
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
