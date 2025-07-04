import os
import sys
import time
import bluetooth
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from threading import Thread
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import numpy as np

class FileSender:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Bluetooth File Sender")
        self.root.geometry("800x600")
        
        self.selected_files = []
        self.transfer_speeds = []
        self.is_transferring = False
        self.current_file_index = 0
        
        self.setup_ui()
        self.scan_devices()
        
    def setup_ui(self):
        # Device selection
        device_frame = ttk.LabelFrame(self.root, text="Bluetooth Device", padding=10)
        device_frame.pack(fill="x", padx=10, pady=5)
        
        self.device_var = tk.StringVar()
        self.device_combo = ttk.Combobox(device_frame, textvariable=self.device_var)
        self.device_combo.pack(side="left", fill="x", expand=True)
        
        refresh_btn = ttk.Button(device_frame, text="Refresh", command=self.scan_devices)
        refresh_btn.pack(side="right", padx=5)
        
        # File selection
        file_frame = ttk.LabelFrame(self.root, text="Files", padding=10)
        file_frame.pack(fill="both", expand=True, padx=10, pady=5)
        
        self.file_list = tk.Listbox(file_frame)
        self.file_list.pack(side="left", fill="both", expand=True)
        
        scrollbar = ttk.Scrollbar(file_frame, orient="vertical", command=self.file_list.yview)
        scrollbar.pack(side="right", fill="y")
        self.file_list.configure(yscrollcommand=scrollbar.set)
        
        # Buttons
        btn_frame = ttk.Frame(self.root, padding=10)
        btn_frame.pack(fill="x", padx=10, pady=5)
        
        add_btn = ttk.Button(btn_frame, text="Add Files", command=self.add_files)
        add_btn.pack(side="left", padx=5)
        
        remove_btn = ttk.Button(btn_frame, text="Remove Selected", command=self.remove_file)
        remove_btn.pack(side="left", padx=5)
        
        self.send_btn = ttk.Button(btn_frame, text="Send Files", command=self.start_transfer)
        self.send_btn.pack(side="right", padx=5)
        
        # Progress
        progress_frame = ttk.LabelFrame(self.root, text="Transfer Progress", padding=10)
        progress_frame.pack(fill="x", padx=10, pady=5)
        
        self.progress_var = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(progress_frame, variable=self.progress_var, maximum=100)
        self.progress_bar.pack(fill="x")
        
        self.status_label = ttk.Label(progress_frame, text="Ready")
        self.status_label.pack(fill="x")
        
        # Speed graph
        graph_frame = ttk.LabelFrame(self.root, text="Transfer Speed", padding=10)
        graph_frame.pack(fill="both", expand=True, padx=10, pady=5)
        
        self.fig, self.ax = plt.subplots(figsize=(8, 3))
        self.canvas = FigureCanvasTkAgg(self.fig, master=graph_frame)
        self.canvas.get_tk_widget().pack(fill="both", expand=True)
        
        self.ax.set_ylabel("Speed (KB/s)")
        self.ax.set_xlabel("Time (s)")
        self.line, = self.ax.plot([], [])
        
    def scan_devices(self):
        self.device_combo['values'] = []
        self.status_label.config(text="Scanning for devices...")
        
        def scan():
            try:
                nearby_devices = bluetooth.discover_devices(lookup_names=True)
                devices = [f"{name} ({addr})" for addr, name in nearby_devices]
                self.root.after(0, lambda: self.device_combo.configure(values=devices))
                self.root.after(0, lambda: self.status_label.config(text="Ready"))
            except Exception as e:
                self.root.after(0, lambda: self.status_label.config(text=f"Error: {str(e)}"))
        
        Thread(target=scan).start()
    
    def add_files(self):
        files = filedialog.askopenfilenames()
        for file in files:
            if file not in self.selected_files:
                self.selected_files.append(file)
                self.file_list.insert(tk.END, os.path.basename(file))
    
    def remove_file(self):
        selection = self.file_list.curselection()
        if selection:
            index = selection[0]
            self.file_list.delete(index)
            self.selected_files.pop(index)
    
    def start_transfer(self):
        if not self.selected_files:
            messagebox.showwarning("Warning", "Please select files to send")
            return
            
        if not self.device_var.get():
            messagebox.showwarning("Warning", "Please select a device")
            return
            
        if not self.is_transferring:
            self.is_transferring = True
            self.send_btn.config(text="Stop Transfer")
            self.current_file_index = 0
            self.transfer_speeds = []
            Thread(target=self.transfer_files).start()
        else:
            self.is_transferring = False
            self.send_btn.config(text="Send Files")
    
    def transfer_files(self):
        device_addr = self.device_var.get().split("(")[-1].strip(")")
        
        try:
            sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
            sock.connect((device_addr, 1))
            
            for file_path in self.selected_files:
                if not self.is_transferring:
                    break
                    
                file_name = os.path.basename(file_path)
                file_size = os.path.getsize(file_path)
                
                # Send file name and size
                header = f"{file_name}|{file_size}\n".encode()
                sock.send(header)
                
                # Send file content
                with open(file_path, 'rb') as f:
                    bytes_sent = 0
                    start_time = time.time()
                    
                    while bytes_sent < file_size and self.is_transferring:
                        chunk = f.read(1024)
                        if not chunk:
                            break
                            
                        sock.send(chunk)
                        bytes_sent += len(chunk)
                        
                        # Update progress
                        progress = (bytes_sent / file_size) * 100
                        self.root.after(0, lambda p=progress: self.progress_var.set(p))
                        
                        # Calculate and update speed
                        elapsed_time = time.time() - start_time
                        if elapsed_time > 0:
                            speed = bytes_sent / (1024 * elapsed_time)  # KB/s
                            self.transfer_speeds.append(speed)
                            self.update_speed_graph()
                            
                        self.root.after(0, lambda s=speed: self.status_label.config(
                            text=f"Sending {file_name}: {bytes_sent}/{file_size} bytes ({speed:.2f} KB/s)"
                        ))
                
                self.current_file_index += 1
            
            sock.close()
            
        except Exception as e:
            self.root.after(0, lambda: messagebox.showerror("Error", str(e)))
        
        finally:
            self.is_transferring = False
            self.root.after(0, lambda: self.send_btn.config(text="Send Files"))
            self.root.after(0, lambda: self.status_label.config(text="Transfer complete"))
    
    def update_speed_graph(self):
        if len(self.transfer_speeds) > 0:
            self.ax.clear()
            self.ax.plot(np.arange(len(self.transfer_speeds)), self.transfer_speeds)
            self.ax.set_ylabel("Speed (KB/s)")
            self.ax.set_xlabel("Time (s)")
            self.canvas.draw()
    
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    sender = FileSender()
    sender.run() 