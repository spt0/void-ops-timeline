# Void — Agenda

Lista de lo que van a hacer los bots de Jaime (Void). Una pantalla, tipografía y hora. Sin cuentas, sin backend y sin panel de control.

Al abrirla se ve algo así:

- en 20 min · Elon — Sube tweet de carrusel
- hoy 16:11 · Gaudí — Confirmación carruseles
- mañana 14:23 · Claudia — Te quiero, señora

Las frases de tiempo están en español y usan la hora de Madrid.

## Abrirla en el iPhone

Hace falta [Expo Go](https://expo.dev/go) (App Store) y Node 20 o más nuevo. No hace falta un Mac.

```bash
npm install
npx expo start
```

Escanea el QR con la cámara del iPhone. El teléfono y el ordenador tienen que estar en la misma red Wi-Fi.

Si el QR no conecta:

```bash
npx expo start --tunnel
```

Para mirarla en el navegador del ordenador: `npx expo start --web`.

## Editar el horario

Todo está en [`src/data/schedule.json`](src/data/schedule.json). Cada fila es un evento:

```json
{
  "id": "elon-carrusel-2026-10-12",
  "when": "2026-10-12T17:11:00+02:00",
  "agent": "Elon",
  "action": "Sube tweet de carrusel",
  "note": "Lunes, miércoles y viernes, sobre las 17:11."
}
```

- `id`: único. Sirve para encontrar la fila.
- `when`: fecha ISO con la zona de Madrid. En horario de verano es `+02:00`. Desde el último domingo de octubre es `+01:00`.
- `agent`: Elon, Gaudí, Claudia, Jordan, o el nombre que toque.
- `action`: la frase corta que sale en la lista.
- `note`: opcional. Se lee al tocar la fila.

La app no repite sola un evento. Si algo ocurre cada lunes, duplica el objeto y cambia `id` y `when`.

Lo que ya pasó no sale en la lista. Esas filas se pueden borrar del JSON.

Después de guardar, recarga el bundle. En la terminal de Expo pulsa `r`. En el iPhone, sacude el teléfono y elige Reload. Guardar el archivo no basta: deslizar la lista no vuelve a leer el JSON.

## Deslizar para refrescar

Recalcula las etiquetas con la hora de ahora: «en 20 min», «en 2 h», «hoy 16:11», «mañana 14:23». No descarga nada.

También se actualizan solas cada medio minuto.

## Filtros

- **Hoy** — lo que queda del día en Madrid.
- **Esta semana** — desde hoy hasta el domingo (la semana empieza el lunes).
- **Todos** — todo lo que aún no ha pasado. Es la vista al abrir.

Si un filtro no tiene nada, aparece el estado vacío.

## De dónde salen los ejemplos

No hay API de Grok Bot. El JSON de partida copia la cadencia real, escrito a mano:

| Quién | Qué | Cuándo |
| --- | --- | --- |
| Elon | Sube tweet de carrusel | Lunes, miércoles y viernes, 17:11 |
| Elon | Reenvía tweet a TC Reply | Laborables, 10:11 |
| Elon | Leads y pitch | Lunes, 16:11 |
| Elon | Informe de crecimiento en X | Lunes, 16:26 |
| Gaudí | Confirmación carruseles | Lunes, 16:11 |
| Claudia | Te quiero, señora | Cada tarde, a una hora distinta |
| Claudia | Revisa reclamación Ryanair | Laborables, 16:11 y 18:11 |
| Claudia | Check-in FR2495 | Lunes 12 oct 2026, 12:43 |
| Jordan | Seguimientos de venta | Ejemplos sueltos (Clipeamos, David Peri, Nichos Faceless, Academia de Lanzamientos) |

Cubre del 11 al 23 de octubre de 2026. Para las semanas siguientes, copia las filas.

Al tocar una fila se ve la nota, la hora exacta y el `when` del JSON.

## Comprobar

```bash
npm test
npx tsc --noEmit
```
