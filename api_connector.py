"""
API Connector - Kết nối output của ai-chatbot với API_find-img
"""
import requests
import json
from typing import Dict, Any, Optional

class APIConnector:
    def __init__(self, api_base_url: str = "http://localhost:3000"):
        """
        Khởi tạo API Connector
        
        Args:
            api_base_url: URL gốc của API_find-img (mặc định: http://localhost:3000)
        """
        self.api_base_url = api_base_url.rstrip('/')
        self.session_id = None
        self.current_step = None
        
    def initialize_workflow(self, brand_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Bước 1: Khởi tạo workflow với brand profile từ chatbot
        
        Args:
            brand_profile: Dict chứa thông tin brand_profile.json
            
        Returns:
            Response từ API với danh sách logos
        """
        url = f"{self.api_base_url}/api/workflow/initialize"
        
        try:
            response = requests.post(
                url,
                json=brand_profile,
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('success'):
                # Lưu session_id để dùng cho các bước tiếp theo
                self.session_id = result['data']['sessionId']
                self.current_step = result['data']['currentStep']
                
                print(f"✅ Workflow initialized successfully!")
                print(f"📝 Session ID: {self.session_id}")
                print(f"🎯 Current Step: {self.current_step}")
                print(f"🎨 Category: {result['data']['category']}")
                print(f"🖼️  Total Logos: {result['data']['totalLogos']}")
                
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error initializing workflow: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def select_logo(self, logo_id: str, category: str, variant: int = 1) -> Dict[str, Any]:
        """
        Bước 2: Chọn logo
        
        Args:
            logo_id: ID của logo được chọn (vd: "Door-1")
            category: Category của logo (vd: "Door")
            variant: Biến thể của logo (mặc định: 1)
            
        Returns:
            Response từ API với danh sách colors
        """
        if not self.session_id:
            return {
                'success': False,
                'message': 'Workflow not initialized. Call initialize_workflow first.'
            }
        
        url = f"{self.api_base_url}/api/workflow/{self.session_id}/logo"
        
        try:
            response = requests.post(
                url,
                json={
                    'logoId': logo_id,
                    'category': category,
                    'variant': variant
                },
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('success'):
                self.current_step = result['data']['currentStep']
                print(f"✅ Logo selected successfully!")
                print(f"🎯 Current Step: {self.current_step}")
                print(f"🎨 Total Colors: {result['data']['totalColors']}")
                
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error selecting logo: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def select_color(self, color: str, color_url: str) -> Dict[str, Any]:
        """
        Bước 3: Chọn màu
        
        Args:
            color: Tên màu (vd: "blue", "red")
            color_url: URL của logo với màu đã chọn
            
        Returns:
            Response từ API với danh sách layouts
        """
        if not self.session_id:
            return {
                'success': False,
                'message': 'Workflow not initialized. Call initialize_workflow first.'
            }
        
        url = f"{self.api_base_url}/api/workflow/{self.session_id}/color"
        
        try:
            response = requests.post(
                url,
                json={
                    'color': color,
                    'colorUrl': color_url
                },
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('success'):
                self.current_step = result['data']['currentStep']
                print(f"✅ Color selected successfully!")
                print(f"🎯 Current Step: {self.current_step}")
                print(f"📐 Total Layouts: {result['data']['totalLayouts']}")
                
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error selecting color: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def select_layout(self, layout_id: str) -> Dict[str, Any]:
        """
        Bước 4: Chọn layout
        
        Args:
            layout_id: ID của layout được chọn (vd: "billboard-1")
            
        Returns:
            Response từ API với danh sách backgrounds
        """
        if not self.session_id:
            return {
                'success': False,
                'message': 'Workflow not initialized. Call initialize_workflow first.'
            }
        
        url = f"{self.api_base_url}/api/workflow/{self.session_id}/layout"
        
        try:
            response = requests.post(
                url,
                json={'layoutId': layout_id},
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('success'):
                self.current_step = result['data']['currentStep']
                print(f"✅ Layout selected successfully!")
                print(f"🎯 Current Step: {self.current_step}")
                print(f"🖼️  Total Backgrounds: {result['data']['totalBackgrounds']}")
                
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error selecting layout: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def select_background(self, background_id: str, bg_type: str, bg_value: str) -> Dict[str, Any]:
        """
        Bước 5: Chọn background
        
        Args:
            background_id: ID của background (vd: "color-1", "image-1")
            bg_type: Type của background ("color" hoặc "image")
            bg_value: Value của background (hex color hoặc image URL)
            
        Returns:
            Response từ API với form customization
        """
        if not self.session_id:
            return {
                'success': False,
                'message': 'Workflow not initialized. Call initialize_workflow first.'
            }
        
        url = f"{self.api_base_url}/api/workflow/{self.session_id}/background"
        
        try:
            response = requests.post(
                url,
                json={
                    'backgroundId': background_id,
                    'type': bg_type,
                    'value': bg_value
                },
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('success'):
                self.current_step = result['data']['currentStep']
                print(f"✅ Background selected successfully!")
                print(f"🎯 Current Step: {self.current_step}")
                
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error selecting background: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def customize(self, customization: Dict[str, Any]) -> Dict[str, Any]:
        """
        Bước 6: Customize text và colors
        
        Args:
            customization: Dict chứa thông tin customize {
                'brandName': str,
                'slogan': str,
                'phone': str,
                'location': str,
                'primaryColor': str,
                'secondaryColor': str
            }
            
        Returns:
            Response từ API xác nhận customization
        """
        if not self.session_id:
            return {
                'success': False,
                'message': 'Workflow not initialized. Call initialize_workflow first.'
            }
        
        url = f"{self.api_base_url}/api/workflow/{self.session_id}/customization"
        
        try:
            response = requests.post(
                url,
                json=customization,
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('success'):
                self.current_step = result['data']['currentStep']
                print(f"✅ Customization saved successfully!")
                print(f"🎯 Current Step: {self.current_step}")
                
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error customizing: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def export_final(self) -> Dict[str, Any]:
        """
        Bước 7: Export final JSON
        
        Returns:
            Response từ API với final JSON để export
        """
        if not self.session_id:
            return {
                'success': False,
                'message': 'Workflow not initialized. Call initialize_workflow first.'
            }
        
        url = f"{self.api_base_url}/api/workflow/{self.session_id}/export"
        
        try:
            response = requests.post(url)
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('success'):
                print(f"✅ Export completed successfully!")
                print(f"📦 Final JSON ready for download")
                
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error exporting: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def get_status(self) -> Dict[str, Any]:
        """
        Lấy status hiện tại của workflow
        
        Returns:
            Response với status hiện tại
        """
        if not self.session_id:
            return {
                'success': False,
                'message': 'Workflow not initialized. Call initialize_workflow first.'
            }
        
        url = f"{self.api_base_url}/api/workflow/{self.session_id}/status"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error getting status: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def reset_to_step(self, step: str) -> Dict[str, Any]:
        """
        Reset workflow về một bước cụ thể
        
        Args:
            step: Tên bước cần reset về ('logo', 'color', 'layout', 'background', 'customization')
            
        Returns:
            Response xác nhận reset
        """
        if not self.session_id:
            return {
                'success': False,
                'message': 'Workflow not initialized. Call initialize_workflow first.'
            }
        
        url = f"{self.api_base_url}/api/workflow/{self.session_id}/reset"
        
        try:
            response = requests.post(
                url,
                json={'step': step},
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('success'):
                self.current_step = result['data']['currentStep']
                print(f"✅ Workflow reset successfully!")
                print(f"🎯 Current Step: {self.current_step}")
                
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error resetting workflow: {e}")
            return {
                'success': False,
                'message': str(e)
            }


def load_brand_profile(json_file: str = "brand_profile.json") -> Optional[Dict[str, Any]]:
    """
    Load brand profile từ file JSON
    
    Args:
        json_file: Đường dẫn đến file brand_profile.json
        
    Returns:
        Dict chứa brand profile hoặc None nếu lỗi
    """
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error loading brand profile: {e}")
        return None


if __name__ == "__main__":
    # Demo: Load brand profile và gửi sang API_find-img
    print("🚀 Starting API Connection Demo...\n")
    
    # 1. Load brand profile
    brand_profile = load_brand_profile("brand_profile.json")
    
    if not brand_profile:
        print("❌ Cannot load brand profile!")
        exit(1)
    
    print("✅ Brand profile loaded successfully!")
    print(f"📝 Brand: {brand_profile.get('brand_name_full')}")
    print(f"📍 Location: {brand_profile.get('location')}\n")
    
    # 2. Khởi tạo connector
    connector = APIConnector(api_base_url="http://localhost:3000")
    
    # 3. Initialize workflow
    print("=" * 60)
    print("STEP 1: Initialize Workflow")
    print("=" * 60)
    result = connector.initialize_workflow(brand_profile)
    
    if result.get('success'):
        print(f"\n📋 Available Logos:")
        for logo in result['data']['logos'][:3]:  # Hiển thị 3 logo đầu
            print(f"  - {logo['id']}: {logo['name']}")
            print(f"    URL: {logo['url']}")
        print(f"  ... and {result['data']['totalLogos'] - 3} more logos\n")
        
        # Lưu kết quả để sử dụng tiếp
        with open("workflow_step1_logos.json", "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print("💾 Logos saved to: workflow_step1_logos.json")
    else:
        print(f"❌ Failed: {result.get('message')}")
    
    print("\n" + "=" * 60)
    print("✅ Demo completed!")
    print("=" * 60)
    print("\n💡 Next steps:")
    print("  1. Check the logos in workflow_step1_logos.json")
    print("  2. Use connector.select_logo(logo_id, category, variant) to continue")
    print("  3. Follow the workflow: logo → color → layout → background → customize → export")
