import urllib.request
import urllib.parse
import os
import mimetypes

def upload_file(file_path):
    url = "https://catbox.moe/user/api.php"
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return None
        
    with open(file_path, "rb") as f:
        file_data = f.read()
        
    filename = os.path.basename(file_path)
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type:
        mime_type = "application/octet-stream"
        
    body = []
    body.append(f"--{boundary}".encode())
    body.append(f'Content-Disposition: form-data; name="reqtype"'.encode())
    body.append(b"")
    body.append(b"fileupload")
    
    body.append(f"--{boundary}".encode())
    body.append(f'Content-Disposition: form-data; name="fileToUpload"; filename="{filename}"'.encode())
    body.append(f"Content-Type: {mime_type}".encode())
    body.append(b"")
    body.append(file_data)
    body.append(f"--{boundary}--".encode())
    
    data = b"\r\n".join(body)
    
    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Content-Length": str(len(data))
    }
    
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            result = response.read().decode("utf-8").strip()
            print(f"Upload success! URL: {result}")
            return result
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python3 upload_to_catbox.py <file_path>")
    else:
        upload_file(sys.argv[1])
