"""
Quick Test - Kiểm tra nhanh kết nối giữa ai-chatbot và API_find-img
"""
import json
from api_connector import APIConnector, load_brand_profile


def main():
    print("🔍 Quick Connection Test\n")
    
    # Test 1: Load brand profile
    print("1️⃣  Testing brand profile loading...")
    brand_profile = load_brand_profile("brand_profile.json")
    
    if not brand_profile:
        print("   ❌ Failed to load brand_profile.json")
        return False
    
    print(f"   ✅ Loaded: {brand_profile.get('brand_name_full')}")
    
    # Test 2: Check API connection
    print("\n2️⃣  Testing API connection...")
    connector = APIConnector(api_base_url="http://localhost:3000")
    
    try:
        import requests
        response = requests.get(f"{connector.api_base_url}/health", timeout=5)
        
        if response.status_code == 200:
            print("   ✅ API is running at http://localhost:3000")
        else:
            print(f"   ⚠️  API responded with status: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to API at http://localhost:3000")
        print("\n   💡 Start API first:")
        print("      cd ../API_find-img")
        print("      npm start")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 3: Initialize workflow
    print("\n3️⃣  Testing workflow initialization...")
    result = connector.initialize_workflow(brand_profile)
    
    if not result.get('success'):
        print(f"   ❌ Failed: {result.get('message')}")
        return False
    
    print(f"   ✅ Session created: {connector.session_id}")
    print(f"   ✅ Category detected: {result['data']['category']}")
    print(f"   ✅ Total logos available: {result['data']['totalLogos']}")
    
    # Save result
    with open("test_connection_result.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n   💾 Result saved to: test_connection_result.json")
    
    # Test 4: Get status
    print("\n4️⃣  Testing status retrieval...")
    status = connector.get_status()
    
    if not status.get('success'):
        print(f"   ❌ Failed: {status.get('message')}")
        return False
    
    print(f"   ✅ Current step: {status['data']['currentStep']}")
    
    # All tests passed
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED!")
    print("=" * 60)
    print("\n💡 You can now run:")
    print("   python test_full_workflow.py")
    print("\n   to complete the full workflow demo")
    
    return True


if __name__ == "__main__":
    try:
        success = main()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
