import keyboard
from datetime import datetime
import requests

# URL de tu API - cambia esta URL por la real
url_api = 'https://arduino-back.vercel.app/api/datos'

# Mapeo de teclas a nombres de botones
teclas_a_botones = {
    'up': 'arriba',
    'down': 'abajo',
    'left': 'izquierda',
    'right': 'derecha'
}

print("Escuchando flechas del teclado... (Presiona Ctrl+C para salir)")

try:
    while True:
        for tecla in teclas_a_botones:
            if keyboard.is_pressed(tecla):
                boton = teclas_a_botones[tecla]
                hora = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                print(f"{hora} - Botón presionado: {boton}")

                payload = {
                    'fechaHora': hora,
                    'dato': boton
                }

                try:
                    response = requests.post(url_api, json=payload)
                    if response.status_code == 200:
                        print("✅ Dato guardado correctamente.")
                    else:
                        print(f"⚠️ Error al enviar. Código: {response.status_code}")
                        print("📬 Respuesta del servidor:", response.text)
                except Exception as e:
                    print(f"❌ Error al conectar con el API: {e}")

                # Esperar a que se suelte la tecla para no enviar repetidos
                keyboard.wait(tecla, suppress=False)
except KeyboardInterrupt:
    print("\nPrograma terminado por el usuario.")
