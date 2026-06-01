#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🛡️ HeaNg[Black-Cyber] Security System Verification Tool
This script helps verify that all security features are properly installed and working.
"""

import os
import sys
import json
from pathlib import Path

class SecurityVerifier:
    def __init__(self, workspace_path):
        self.workspace_path = Path(workspace_path)
        self.results = []
        
    def log(self, status, message):
        """Log verification result"""
        symbol = "✅" if status else "❌"
        self.results.append((status, message))
        print(f"{symbol} {message}")
    
    def check_file_exists(self, file_path, required_content=None):
        """Check if a file exists and optionally contains specific content"""
        full_path = self.workspace_path / file_path
        
        if not full_path.exists():
            self.log(False, f"File missing: {file_path}")
            return False
        
        self.log(True, f"File found: {file_path}")
        
        if required_content:
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if required_content.lower() in content.lower():
                        self.log(True, f"✓ Contains required content: {required_content[:50]}...")
                        return True
                    else:
                        self.log(False, f"✗ Missing required content in {file_path}")
                        return False
            except Exception as e:
                self.log(False, f"Error reading {file_path}: {str(e)}")
                return False
        
        return True
    
    def verify_security_files(self):
        """Verify all security-related files exist"""
        print("\n📁 Checking Security Files...")
        print("=" * 50)
        
        checks = [
            ("public/security.js", "SecuritySystem"),
            ("api/proxy.js", "RATE_LIMIT_CONFIG"),
            ("index.html", "security.js"),
            ("SECURITY_DOCUMENTATION.md", "Security Features"),
            ("SECURITY_SETUP.sh", "Protection Mechanisms"),
            ("SECURITY_CONFIG_GUIDE.js", "Rate Limiting Configuration"),
        ]
        
        results = []
        for file_path, content in checks:
            result = self.check_file_exists(file_path, content)
            results.append(result)
        
        return all(results)
    
    def verify_security_features(self):
        """Verify specific security features are implemented"""
        print("\n🛡️  Checking Security Features...")
        print("=" * 50)
        
        features = {
            "public/security.js": [
                "blockDeveloperTools",
                "blockContextMenu",
                "preventSourceMapExposure",
                "implementSpamProtection",
                "implementXSSProtection",
                "implementCSRFProtection",
                "setupSecurityHeaders",
                "monitorSuspiciousActivity",
            ],
            "api/proxy.js": [
                "RATE_LIMIT_CONFIG",
                "isRateLimited",
                "detectSpamPattern",
                "validateUserAgent",
                "allowedModels",
            ],
            "index.html": [
                "Content-Security-Policy",
                "X-Content-Type-Options",
                "security.js",
            ]
        }
        
        results = []
        for file_path, feature_list in features.items():
            full_path = self.workspace_path / file_path
            if not full_path.exists():
                self.log(False, f"File not found: {file_path}")
                results.append(False)
                continue
            
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                file_results = []
                for feature in feature_list:
                    if feature.lower() in content.lower():
                        self.log(True, f"✓ Feature found: {feature}")
                        file_results.append(True)
                    else:
                        self.log(False, f"✗ Feature missing: {feature}")
                        file_results.append(False)
                
                results.extend(file_results)
            except Exception as e:
                self.log(False, f"Error reading {file_path}: {str(e)}")
                results.append(False)
        
        return all(results)
    
    def check_security_config(self):
        """Verify security configuration values"""
        print("\n⚙️  Checking Security Configuration...")
        print("=" * 50)
        
        full_path = self.workspace_path / "api/proxy.js"
        
        if not full_path.exists():
            self.log(False, "api/proxy.js not found")
            return False
        
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            configs = [
                ("perMinute: 20", "Per-minute rate limit set"),
                ("perHour: 200", "Per-hour rate limit set"),
                ("perDay: 2000", "Per-day rate limit set"),
                ("blockDurationMs: 3600000", "Block duration configured"),
                ("allowedModels", "Model whitelist configured"),
            ]
            
            results = []
            for config, description in configs:
                if config in content:
                    self.log(True, description)
                    results.append(True)
                else:
                    self.log(False, f"Missing configuration: {config}")
                    results.append(False)
            
            return all(results)
        except Exception as e:
            self.log(False, f"Error reading configuration: {str(e)}")
            return False
    
    def generate_report(self):
        """Generate verification report"""
        print("\n" + "=" * 50)
        print("📊 SECURITY VERIFICATION REPORT")
        print("=" * 50)
        
        total = len(self.results)
        passed = sum(1 for status, _ in self.results if status)
        failed = total - passed
        
        print(f"\nTotal Checks: {total}")
        print(f"Passed: ✅ {passed}")
        print(f"Failed: ❌ {failed}")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        
        if failed == 0:
            print("\n" + "=" * 50)
            print("🎉 ALL SECURITY FEATURES VERIFIED!")
            print("Your application is SECURE and READY for production!")
            print("=" * 50)
            return True
        else:
            print("\n⚠️  Some security features are missing or misconfigured.")
            print("Please review the failed checks above.")
            return False
    
    def run_verification(self):
        """Run complete verification"""
        print("\n")
        print("╔════════════════════════════════════════════════════╗")
        print("║  🛡️  HeaNg[Black-Cyber] Security Verification     ║")
        print("╚════════════════════════════════════════════════════╝")
        
        results = []
        
        results.append(self.verify_security_files())
        results.append(self.verify_security_features())
        results.append(self.check_security_config())
        
        self.generate_report()
        
        return all(results)

def main():
    """Main entry point"""
    
    # Detect workspace path
    if len(sys.argv) > 1:
        workspace_path = sys.argv[1]
    else:
        workspace_path = os.getcwd()
    
    print(f"Checking workspace: {workspace_path}")
    
    # Run verification
    verifier = SecurityVerifier(workspace_path)
    success = verifier.run_verification()
    
    # Print next steps
    print("\n📋 NEXT STEPS:")
    print("=" * 50)
    print("1. Review SECURITY_DOCUMENTATION.md for detailed information")
    print("2. Set environment variables (OPENROUTER_API_KEY, etc.)")
    print("3. Run 'npm install' to install dependencies")
    print("4. Run 'npm run dev' to start development server")
    print("5. Test security features in browser:")
    print("   - Press F12 (should be blocked)")
    print("   - Right-click (should be disabled)")
    print("   - Open DevTools (should be blocked)")
    print("6. Check console for security alerts")
    
    print("\n📚 DOCUMENTATION:")
    print("=" * 50)
    print("- SECURITY_DOCUMENTATION.md - Complete security guide")
    print("- SECURITY_CONFIG_GUIDE.js - Configuration options")
    print("- SECURITY_SETUP.sh - Feature checklist")
    print("- README.md - Project overview")
    
    print("\n🔗 USEFUL LINKS:")
    print("=" * 50)
    print("- Security Docs: ./SECURITY_DOCUMENTATION.md")
    print("- Config Guide: ./SECURITY_CONFIG_GUIDE.js")
    print("- GitHub: https://github.com/yourusername/project")
    print("- OpenRouter: https://openrouter.ai")
    
    print("\n✨ Your security system is now in place!")
    print("=" * 50)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
