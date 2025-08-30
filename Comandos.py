import serial
from datetime import datetime

# Ajusta el puerto según tu sistema: COM3 en Windows o /dev/ttyUSB0 en Linux
arduino = serial.Serial('COM3', 9600, timeout=1)

print("Esperando datos del Arduino...")

while True:
    if arduino.in_waiting > 0:
        dato = arduino.readline().decode().strip()
        if dato:
            hora = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"{hora} - Botón presionado: {dato}")
