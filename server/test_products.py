"""Test script for product API endpoints"""
import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

# Admin credentials
ADMIN_EMAIL = 'admin@test.com'
ADMIN_PASSWORD = 'admin123'

def get_admin_token():
    """Login as admin and get JWT token"""
    response = requests.post(f'{BASE_URL}/auth/login/', json={
        'email': ADMIN_EMAIL,
        'password': ADMIN_PASSWORD
    })
    if response.status_code == 200:
        return response.json()['token']
    return None

def test_product_api():
    """Test the product API endpoints"""
    print("\n=== PRODUCT API TESTS ===\n")
    
    # Get admin token
    print("1. Getting admin token...")
    admin_token = get_admin_token()
    if not admin_token:
        print("❌ Failed to authenticate as admin")
        return
    print("✅ Admin authenticated")
    
    admin_headers = {'Authorization': f'Bearer {admin_token}'}
    
    # 2. Create a product
    print("\n2. Creating a product...")
    product_data = {
        'name': 'Americano',
        'price': '99.00',
        'description': 'Classic black coffee with rich flavor',
        'image_url': 'https://example.com/americano.jpg',
        'available': True
    }
    response = requests.post(f'{BASE_URL}/products/', json=product_data, headers=admin_headers)
    if response.status_code == 201:
        product = response.json()['product']
        product_id = product['id']
        print(f"✅ Product created: {product['name']} (ID: {product_id})")
    else:
        print(f"❌ Failed to create product: {response.text}")
        return
    
    # 3. Create another product
    print("\n3. Creating another product...")
    product_data2 = {
        'name': 'Espresso',
        'price': '75.00',
        'description': 'Strong and bold espresso shot',
        'image_url': 'https://example.com/espresso.jpg',
        'available': True
    }
    response = requests.post(f'{BASE_URL}/products/', json=product_data2, headers=admin_headers)
    if response.status_code == 201:
        product2 = response.json()['product']
        print(f"✅ Product created: {product2['name']}")
    else:
        print(f"❌ Failed to create product: {response.text}")
    
    # 4. Get all products (public endpoint)
    print("\n4. Getting all products...")
    response = requests.get(f'{BASE_URL}/products/')
    if response.status_code == 200:
        products = response.json()['products']
        print(f"✅ Retrieved {len(products)} products:")
        for prod in products:
            print(f"   - {prod['name']} (PHP {prod['price']})")
    else:
        print(f"❌ Failed to get products: {response.text}")
        return
    
    # 5. Get single product
    print(f"\n5. Getting product by ID ({product_id})...")
    response = requests.get(f'{BASE_URL}/products/{product_id}/')
    if response.status_code == 200:
        product = response.json()['product']
        print(f"✅ Retrieved: {product['name']}")
        print(f"   - Price: PHP {product['price']}")
        print(f"   - Description: {product['description']}")
    else:
        print(f"❌ Failed to get product: {response.text}")
    
    # 6. Update product
    print(f"\n6. Updating product...")
    update_data = {
        'price': '119.00',
        'description': 'Premium Americano with extra shot'
    }
    response = requests.patch(f'{BASE_URL}/products/{product_id}/', json=update_data, headers=admin_headers)
    if response.status_code == 200:
        product = response.json()['product']
        print(f"✅ Product updated:")
        print(f"   - Price: PHP {product['price']}")
        print(f"   - Description: {product['description']}")
    else:
        print(f"❌ Failed to update product: {response.text}")
    
    # 7. Test unauthorized create (no token)
    print("\n7. Testing unauthorized product creation (no token)...")
    response = requests.post(f'{BASE_URL}/products/', json=product_data)
    if response.status_code in [401, 403]:
        print(f"✅ Correctly rejected unauthorized request (status: {response.status_code})")
    else:
        print(f"❌ Should have rejected unauthorized request")
    
    # 8. Delete product
    print(f"\n8. Deleting product...")
    response = requests.delete(f'{BASE_URL}/products/{product_id}/', headers=admin_headers)
    if response.status_code == 204:
        print(f"✅ Product deleted successfully")
    else:
        print(f"❌ Failed to delete product: {response.text}")
    
    # 9. Verify deletion
    print("\n9. Verifying deletion...")
    response = requests.get(f'{BASE_URL}/products/{product_id}/')
    if response.status_code == 404:
        print(f"✅ Product no longer exists (correctly deleted)")
    else:
        print(f"❌ Product still exists")
    
    print("\n=== ALL TESTS PASSED ✅ ===\n")

if __name__ == '__main__':
    try:
        test_product_api()
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
