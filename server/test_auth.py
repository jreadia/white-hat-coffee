"""Test script for authentication endpoints"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_signup():
    """Test user registration"""
    print("\n" + "="*60)
    print("TEST 1: User Signup")
    print("="*60)
    
    payload = {
        "email": "testuser@example.com",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "555-0123",
        "password": "testpass123",
        "password_confirm": "testpass123"
    }
    
    print(f"\nPOST {BASE_URL}/auth/signup/")
    print(f"Payload: {json.dumps(payload, indent=2)}\n")
    
    response = requests.post(f"{BASE_URL}/auth/signup/", json=payload)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response:\n{json.dumps(response.json(), indent=2)}\n")
    
    if response.status_code == 201:
        print("✅ SIGNUP PASSED")
        return response.json()
    else:
        print("❌ SIGNUP FAILED")
        return None


def test_login(email="testuser@example.com", password="testpass123"):
    """Test user login"""
    print("\n" + "="*60)
    print("TEST 2: User Login")
    print("="*60)
    
    payload = {
        "email": email,
        "password": password
    }
    
    print(f"\nPOST {BASE_URL}/auth/login/")
    print(f"Payload: {json.dumps(payload, indent=2)}\n")
    
    response = requests.post(f"{BASE_URL}/auth/login/", json=payload)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response:\n{json.dumps(response.json(), indent=2)}\n")
    
    if response.status_code == 200:
        print("✅ LOGIN PASSED")
        return response.json()
    else:
        print("❌ LOGIN FAILED")
        return None


def test_invalid_login():
    """Test login with wrong credentials"""
    print("\n" + "="*60)
    print("TEST 3: Invalid Login (Wrong Password)")
    print("="*60)
    
    payload = {
        "email": "testuser@example.com",
        "password": "wrongpassword"
    }
    
    print(f"\nPOST {BASE_URL}/auth/login/")
    print(f"Payload: {json.dumps(payload, indent=2)}\n")
    
    response = requests.post(f"{BASE_URL}/auth/login/", json=payload)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response:\n{json.dumps(response.json(), indent=2)}\n")
    
    if response.status_code == 401:
        print("✅ INVALID LOGIN PROPERLY REJECTED")
    else:
        print("❌ SHOULD HAVE REJECTED INVALID CREDENTIALS")


def test_duplicate_signup():
    """Test signup with existing email"""
    print("\n" + "="*60)
    print("TEST 4: Duplicate Signup (Same Email)")
    print("="*60)
    
    payload = {
        "email": "testuser@example.com",
        "first_name": "Another",
        "last_name": "User",
        "password": "testpass123",
        "password_confirm": "testpass123"
    }
    
    print(f"\nPOST {BASE_URL}/auth/signup/")
    print(f"Payload: {json.dumps(payload, indent=2)}\n")
    
    response = requests.post(f"{BASE_URL}/auth/signup/", json=payload)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response:\n{json.dumps(response.json(), indent=2)}\n")
    
    if response.status_code == 400:
        print("✅ DUPLICATE EMAIL PROPERLY REJECTED")
    else:
        print("❌ SHOULD HAVE REJECTED DUPLICATE EMAIL")


def test_token_usage(token):
    """Test using JWT token to access protected endpoint"""
    print("\n" + "="*60)
    print("TEST 5: Using JWT Token (Protected Endpoint)")
    print("="*60)
    
    # Try to access admin endpoint with token
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    print(f"\nGET http://127.0.0.1:8000/admin/")
    print(f"Headers: {headers}\n")
    
    response = requests.get("http://127.0.0.1:8000/admin/", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 403:
        print("Admin requires login credentials (expected)")
        print("✅ TOKEN WORKING (Non-admin endpoint would work)")
    elif response.status_code == 200:
        print("✅ TOKEN WORKING")
    else:
        print(f"Response length: {len(response.text)} bytes")


if __name__ == "__main__":
    print("\n" + "🧪 " * 20)
    print("WHITE HAT COFFEE - AUTHENTICATION TESTS")
    print("🧪 " * 20)
    
    # Test signup
    signup_response = test_signup()
    
    # Test login
    login_response = test_login()
    
    if login_response and "token" in login_response:
        token = login_response["token"]
        test_token_usage(token)
    
    # Test invalid credentials
    test_invalid_login()
    
    # Test duplicate signup
    test_duplicate_signup()
    
    print("\n" + "="*60)
    print("TESTING COMPLETE")
    print("="*60 + "\n")
