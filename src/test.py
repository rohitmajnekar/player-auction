import os

def rename_extensions_to_jpg(folder_path):
    # Check if the folder path exists
    if not os.path.exists(folder_path):
        print(f"The folder path {folder_path} does not exist.")
        return
    
    # Iterate over all files in the folder
    for filename in os.listdir(folder_path):
        # Construct full file path
        file_path = os.path.join(folder_path, filename)
        
        # Check if it's a file (not a directory)
        if os.path.isfile(file_path):
            # Split the file name and extension
            base_name, _ = os.path.splitext(filename)
            # Construct new file name with .jpg extension
            new_file_path = os.path.join(folder_path, f"{base_name}.jpg")
            # Rename the file
            os.rename(file_path, new_file_path)
            print(f"Renamed: {file_path} to {new_file_path}")

# Example usage:
folder_path = "C:/Users/guest_gxs4ifg/Downloads/logos"
rename_extensions_to_jpg(folder_path)
