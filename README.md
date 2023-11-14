# G07-TPI-1CUAT-2023

# Proyecto

**Alumnos:** José Chiappetti, Luca Converti, Lucca Moyano, Ignacio Serdá

## Nombre del Proyecto

**“POKEMON COLISEUM”**

## Descripción Del Proyecto

**“POKEMON COLISEUM”** es un juego de simulación de peleas Pokémon. En este vas a poder formar tus propios equipos con los movimientos y habilidades que quieras. También, cuenta con un apartado de partidas randomizadas en donde los equipos se decidiran a la suerte. Juga y ganá para sumar puntos en el ranking local y aparecer primero de la tabla. Logueate para guardar tu progreso y personalizar tu perfil para hacerte distinguir entre los demás jugadores. Podrás ver tus estadisticas y datos personales para poder mejorar. En medio de los encuentros, podrás chatear con tu rival para poder hacerle saber que le pegaste una paliza táctica. El conocimiento Pokémon lo es todo.

El usuario podrá realizar esta serie de acciones:

- Encontrar batallas pokemon con usuarios online
- Crear Equipos
- Sumar puntos en el ranking
- Ver el Ranking
- Chatear con otros usuarios
- Estadisticas Personales
- Personalizar su Perfil
- Cambiar su contraseña
- Cerrar Sesión

## Tecnología Usada

**Front-End**

- HTML5
- CSS3

**Back-End**

- JavaScript
- SQL3
- NodeJS
- Firebase
- Web Sockets

## Documentación EndPoint
**Metodo POST (/login)**
-Petición: User & Password
**Caso 1:**
-Respuesta: True
**Caso 2:**
-Respuesta: False, msg("El usuario ya se encuentra logueado")
**Caso 3**
-Respuesta: False, msg("La contraseña/usuario no son correctos")

**Metodo POST (/register)**
-Petición: Name, Surname, Username, Password, Mail
**Caso 1:**
-Respuesta: True
**Caso 2:**
-Respuesta: False

**Metodo POST (/changeAvatar)**
-Petición: Team
![image](https://github.com/PioIX/G07-TPFINAL-2023/assets/104986406/1cf158cf-e836-453d-abbb-ca3588419905)
