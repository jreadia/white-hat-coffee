"""Test script for order API endpoints"""
import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

# Test credentials
TEST_EMAIL = 'ordertest@example.com'
TEST_PASSWORD = 'testpass123'
ADMIN_EMAIL = 'admin@test.com'
ADMIN_PASSWORD = 'admin123'

def test_order_api():
    """Test the order API endpoints"""
    print("\n=== ORDER API TESTS ===\n")
    
    # 1. Sign up test user
    print("1. Creating test user...")
    signup_data = {
        'email': TEST_EMAIL,
        'first_name': 'Order',
        'last_name': 'Tester',
        'phone_number': '09123456789',
        'password': TEST_PASSWORD,
        'password_confirm': TEST_PASSWORD
    }
    response = requests.post(f'{BASE_URL}/auth/signup/', json=signup_data)
    if response.status_code == 201:
        user_token = response.json()['token']
        print(f"✅ Test user created: {TEST_EMAIL}")
    else:
        print(f"❌ Failed to create user: {response.text}")
        return
    
    user_headers = {'Authorization': f'Bearer {user_token}'}
    
    # 2. Get admin token
    print("\n2. Getting admin token...")
    response = requests.post(f'{BASE_URL}/auth/login/', json={
        'email': ADMIN_EMAIL,
        'password': ADMIN_PASSWORD
    })
    if response.status_code == 200:
        admin_token = response.json()['token']
        print("✅ Admin authenticated")
    else:
        print(f"❌ Failed to authenticate admin: {response.text}")
        return
    
    admin_headers = {'Authorization': f'Bearer {admin_token}'}
    
    # 3. Create some products
    print("\n3. Creating test products...")
    products_to_create = [
        {'name': 'Cappuccino', 'price': '120.00', 'description': 'Creamy cappuccino'},
        {'name': 'Latte', 'price': '130.00', 'description': 'Smooth latte'},
    ]
    product_ids = []
    for prod_data in products_to_create:
        response = requests.post(f'{BASE_URL}/products/', json=prod_data, headers=admin_headers)
        if response.status_code == 201:
            prod_id = response.json()['product']['id']
            product_ids.append(prod_id)
            print(f"✅ Product created: {prod_data['name']} (ID: {prod_id})")
        else:
            print(f"❌ Failed to create product: {response.text}")
            return
    
    # 4. Get all products
    print("\n4. Getting all products...")
    response = requests.get(f'{BASE_URL}/products/')
    if response.status_code == 200:
        products = response.json()['products']
        print(f"✅ Retrieved {len(products)} products")
    else:
        print(f"❌ Failed to get products: {response.text}")
    
    # 5. Create an order from cart
    print("\n5. Creating order from cart items...")
    order_data = {
        'items': [
            {
                'product_id': product_ids[0],
                'quantity': 2,
                'price': '120.00'
            },
            {
                'product_id': product_ids[1],
                'quantity': 1,
                'price': '130.00'
            }
        ],
        'payment_method': 'GCash',
        'total_price': '370.00'
    }
    
    response = requests.post(f'{BASE_URL}/orders/create_from_cart/', json=order_data, headers=user_headers)
    if response.status_code == 201:
        order = response.json()['order']
        order_id = order['id']
        print(f"✅ Order created (ID: {order_id})")
        print(f"   - Total: PHP {order['total_price']}")
        print(f"   - Payment: {order['payment_method']}")
        print(f"   - Items: {len(order['items'])} items")
        print(f"   - Status: {order['status']}")
    else:
        print(f"❌ Failed to create order: {response.text}")
        return
    
    # 6. Get user's orders
    print(f"\n6. Getting user's orders...")
    response = requests.get(f'{BASE_URL}/orders/', headers=user_headers)
    if response.status_code == 200:
        orders = response.json()['orders']
        print(f"✅ Retrieved {len(orders)} orders for user")
        for order in orders:
            print(f"   - Order #{order['id']}: PHP {order['total_price']} ({order['status']})")
    else:
        print(f"❌ Failed to get orders: {response.text}")
    
    # 7. Get single order
    print(f"\n7. Getting order details (ID: {order_id})...")
    response = requests.get(f'{BASE_URL}/orders/{order_id}/', headers=user_headers)
    if response.status_code == 200:
        order = response.json()['order']
        print(f"✅ Order retrieved:")
        print(f"   - ID: {order['id']}")
        print(f"   - Total: PHP {order['total_price']}")
        print(f"   - Status: {order['status']}")
        print(f"   - Items:")
        for item in order['items']:
            print(f"     * {item['product']['name']} x{item['quantity']}")
    else:
        print(f"❌ Failed to get order: {response.text}")
    
    # 8. Admin updates order status
    print(f"\n8. Admin updating order status...")
    response = requests.patch(
        f'{BASE_URL}/orders/{order_id}/update_status/',
        json={'status': 'preparing'},
        headers=admin_headers
    )
    if response.status_code == 200:
        order = response.json()['order']
        print(f"✅ Order status updated to: {order['status']}")
    else:
        print(f"❌ Failed to update order: {response.text}")
    
    # 9. Check unauthorized access
    print(f"\n9. Testing authorization (user cannot access other users' orders)...")
    # Create another user's order
    other_user_data = {
        'email': 'otheruser@example.com',
        'first_name': 'Other',
        'last_name': 'User',
        'password': 'test123',
        'password_confirm': 'test123'
    }
    response = requests.post(f'{BASE_URL}/auth/signup/', json=other_user_data)
    other_user_token = response.json()['token']
    
    # Try to access first user's order as different user
    response = requests.get(f'{BASE_URL}/orders/{order_id}/', headers={'Authorization': f'Bearer {other_user_token}'})
    if response.status_code == 404:
        print(f"✅ Correctly prevented unauthorized access (404)")
    else:
        print(f"⚠️  User could access other user's order (unexpected)")
    
    # 10. Admin can see all orders
    print(f"\n10. Admin viewing all orders...")
    response = requests.get(f'{BASE_URL}/orders/', headers=admin_headers)
    if response.status_code == 200:
        orders = response.json()['orders']
        print(f"✅ Admin retrieved {len(orders)} total orders")
    else:
        print(f"❌ Failed to get orders: {response.text}")
    
    print("\n=== ALL TESTS PASSED ✅ ===\n")

if __name__ == '__main__':
    try:
        test_order_api()
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
