"""
Full Workflow Demo - Test toàn bộ quy trình từ chatbot output đến export
"""
import json
from api_connector import APIConnector, load_brand_profile
from database import get_brand_profile_by_session



def print_section(title: str):
    """In tiêu đề section"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def display_options(items: list, item_type: str = "item"):
    """Hiển thị danh sách options"""
    print(f"\n📋 Available {item_type}s:")
    for i, item in enumerate(items[:5], 1):  # Hiển thị tối đa 5 items
        if isinstance(item, dict):
            if 'id' in item and 'name' in item:
                print(f"  {i}. {item['id']}: {item['name']}")
            elif 'id' in item:
                print(f"  {i}. {item['id']}")
            else:
                print(f"  {i}. {item}")
        else:
            print(f"  {i}. {item}")
    
    if len(items) > 5:
        print(f"  ... and {len(items) - 5} more {item_type}s")

def main():
    """Main workflow demo"""
    print_section("🚀 FULL WORKFLOW DEMO - CHATBOT TO EXPORT")

    # ========================================================================
    # STEP 1 + 2.5: Fetch Brand Profile & API Health via /health
    # ========================================================================
    print_section("STEP 1: Fetch Brand Profile from FastAPI /health")

    import requests
    connector_chat = APIConnector(api_base_url="http://localhost:8000")  # FastAPI port
    connector = APIConnector(api_base_url="http://localhost:3000")

    session_id = "12fe98f9"
    print(f"🧩 Using sessionId: {session_id}")

    try:
        health_url = f"{connector_chat.api_base_url}/health"
        params = {"sessionId": session_id}
        response = requests.get(health_url, params=params, timeout=5)

        if response.status_code == 200:
            data = response.json()
            print("✅ API health check successful!")
            print(f"🧠 Message: {data.get('message')}")
            print(f"🧩 SessionId confirmed: {data.get('sessionId')}")

            brand_profile = data.get("brand_profile")
            if not brand_profile:
                print("❌ No brand_profile found in response!")
                return

            print("✅ Brand profile loaded successfully from API!")
            print(f"📝 Brand Name: {brand_profile.get('brand_name_full')}")
            print(f"📍 Location: {brand_profile.get('location')}")
            print(f"🎨 Logo Style: {', '.join(brand_profile.get('logo_style', []))}")
            print(f"🎯 Main Products: {', '.join(brand_profile.get('main_products', []))}")

        else:
            print(f"⚠️ API health check failed: {response.status_code}")
            print("Response:", response.text)
            return

    except Exception as e:
        print(f"❌ Cannot connect to /health API: {e}")
        return

    # ========================================================================
    # STEP 3: Initialize Workflow & Get Logos
    # ========================================================================
    print_section("STEP 3: Initialize Workflow & Get Logos")

    # Gửi sessionId đi cùng với brand_profile
    result = connector.initialize_workflow({
        **brand_profile,
        "sessionId": session_id
    })
    
    if not result.get('success'):
        print(f"❌ Failed to initialize: {result.get('message')}")
        return
    
    logos = result['data']['logos']
    category = result['data']['category']
    display_options(logos, "logo")
    
    # Lưu kết quả
    with open("workflow_results.json", "w", encoding="utf-8") as f:
        json.dump({"step": "logos", "data": result}, f, ensure_ascii=False, indent=2)
    
    print("✅ Workflow initialized successfully!")
    
    # ========================================================================
    # STEP 4: Select Logo (Auto select first logo for demo)
    # ========================================================================
    print_section("STEP 4: Select Logo")
    
    # Tự động chọn logo đầu tiên để demo
    selected_logo = logos[0]
    print(f"🎯 Auto-selecting: {selected_logo['id']} - {selected_logo['name']}")
    
    result = connector.select_logo(
        logo_id=selected_logo['id'],
        category=category,
        variant=1
    )
    
    if not result.get('success'):
        print(f"❌ Failed to select logo: {result.get('message')}")
        return
    
    colors = result['data']['colors']
    display_options(colors, "color")
    
    # ========================================================================
    # STEP 5: Select Color
    # ========================================================================
    print_section("STEP 5: Select Color")
    
    # Tự động chọn màu đầu tiên
    selected_color = colors[0]
    print(f"🎨 Auto-selecting: {selected_color['color']}")
    
    result = connector.select_color(
        color=selected_color['color'],
        color_url=selected_color['url']
    )
    
    if not result.get('success'):
        print(f"❌ Failed to select color: {result.get('message')}")
        return
    
    layouts = result['data']['layouts']
    display_options(layouts, "layout")
    
    # ========================================================================
    # STEP 6: Select Layout
    # ========================================================================
    print_section("STEP 6: Select Layout")
    
    # Tự động chọn layout đầu tiên
    selected_layout = layouts[0]
    print(f"📐 Auto-selecting: {selected_layout['id']} - {selected_layout['name']}")
    
    result = connector.select_layout(layout_id=selected_layout['id'])
    
    if not result.get('success'):
        print(f"❌ Failed to select layout: {result.get('message')}")
        return
    
    backgrounds = result['data']['backgrounds']
    display_options(backgrounds, "background")
    
    # ========================================================================
    # STEP 7: Select Background
    # ========================================================================
    print_section("STEP 7: Select Background")
    
    # Tự động chọn background đầu tiên
    selected_background = backgrounds[0]
    print(f"🖼️  Auto-selecting: {selected_background['id']} - {selected_background.get('name', 'N/A')}")
    
    result = connector.select_background(
        background_id=selected_background['id'],
        bg_type=selected_background['type'],
        bg_value=selected_background['value']
    )
    
    if not result.get('success'):
        print(f"❌ Failed to select background: {result.get('message')}")
        return
    
    print("✅ Background selected!")
    
    # ========================================================================
    # STEP 8: Customize
    # ========================================================================
    print_section("STEP 8: Customize Text & Colors")
    
    customization = {
        'brandName': brand_profile.get('brand_name_full'),
        'slogan': brand_profile.get('slogan'),
        'phone': brand_profile.get('dealer_id'),
        'location': brand_profile.get('location'),
        'primaryColor': brand_profile.get('main_color', ['#0066CC'])[0],
        'secondaryColor': '#FFFFFF'
    }
    
    print(f"📝 Customization data:")
    print(f"  - Brand Name: {customization['brandName']}")
    print(f"  - Slogan: {customization['slogan']}")
    print(f"  - Phone: {customization['phone']}")
    print(f"  - Location: {customization['location']}")
    
    result = connector.customize(customization)
    
    if not result.get('success'):
        print(f"❌ Failed to customize: {result.get('message')}")
        return
    
    print("✅ Customization saved!")
    
    # ========================================================================
    # STEP 9: Export Final JSON
    # ========================================================================
    print_section("STEP 9: Export Final JSON")
    
    result = connector.export_final()
    
    if not result.get('success'):
        print(f"❌ Failed to export: {result.get('message')}")
        return
    
    # Lưu kết quả final
    final_json = result['data']
    with open("final_export.json", "w", encoding="utf-8") as f:
        json.dump(final_json, f, ensure_ascii=False, indent=2)
    
    print("✅ Export completed successfully!")
    print(f"💾 Final JSON saved to: final_export.json")
    
    # ========================================================================
    # STEP 10: Get Final Status
    # ========================================================================
    print_section("STEP 10: Check Final Status")
    
    status = connector.get_status()
    
    if status.get('success'):
        session_data = status['data']
        print(f"📊 Session Status:")
        print(f"  - Session ID: {session_data['sessionId']}")
        print(f"  - Current Step: {session_data['currentStep']}")
        print(f"  - Created: {session_data['createdAt']}")
        print(f"  - Updated: {session_data['updatedAt']}")
        
        print(f"\n🎨 Selected Items:")
        selections = session_data.get('selections', {})
        if selections.get('logo'):
            print(f"  - Logo: {selections['logo']['name']}")
        if selections.get('color'):
            print(f"  - Color: {selections['color']['color']}")
        if selections.get('layout'):
            print(f"  - Layout: {selections['layout']['id']}")
        if selections.get('background'):
            print(f"  - Background: {selections['background']['id']}")
    
    # ========================================================================
    # SUMMARY
    # ========================================================================
    print_section("✅ WORKFLOW COMPLETED SUCCESSFULLY!")
    
    print("\n📦 Generated Files:")
    print("  1. workflow_results.json - Intermediate results")
    print("  2. final_export.json - Final export ready for use")
    
    print("\n💡 What's Next?")
    print("  - Use final_export.json for logo generation")
    print("  - Or modify selections using connector.reset_to_step()")
    print("  - Or start a new workflow with different brand profile")
    
    print("\n" + "=" * 70 + "\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Demo interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Demo failed with error: {e}")
        import traceback
        traceback.print_exc()
