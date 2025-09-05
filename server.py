#!/usr/bin/env python3
"""
Simple HTTP server for local development
Run this to avoid CORS issues when testing locally
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Set the directory to serve files from
PORT = 3001
DIRECTORY = Path(__file__).parent

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        # Cache control for better performance
        self.send_header('Cache-Control', 'public, max-age=3600')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def guess_type(self, path):
        # Ensure proper MIME types
        if path.lower().endswith('.mp4'):
            return 'video/mp4', None
        elif path.lower().endswith('.pdf'):
            return 'application/pdf', None
        elif path.lower().endswith('.mov'):
            return 'video/quicktime', None
        return super().guess_type(path)

def main():
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
        print(f"\n🚀 Animation Website Server")
        print(f"📁 Serving files from: {DIRECTORY}")
        print(f"🌐 Open your browser to: http://localhost:{PORT}")
        print(f"📱 For mobile testing: http://your-ip-address:{PORT}")
        print(f"⏹️  Press Ctrl+C to stop the server\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped by user")
            sys.exit(0)

if __name__ == "__main__":
    main()