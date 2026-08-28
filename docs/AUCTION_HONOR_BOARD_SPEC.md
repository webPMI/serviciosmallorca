# 👑 Especificación Técnica: Sistema de Subasta Dinámica Incremental (+1€) y Cuadro de Honor

**Documento Oficial de Arquitectura y Mecánica Económica**  
_Plataforma Servicios Mallorca · Versión 2.0_

---

## 🎯 1. Concepto y Visión General

El **Cuadro de Honor de Mallorca** implementa una mecánica de **reconocimiento comunitario y micro-subastas de escalera infinita (+1.00€)**.

A diferencia de los modelos tradicionales de publicidad digital opacos (como Google Ads o pujas por clic variables e impredecibles), este sistema es **100% público, transparente, determinista y gamificado**:

> **"Cualquiera puede ser el número uno (#1) si supera en exactamente 1€ la mayor puja histórica registrada."**

---

## 🪜 2. La Mecánica de Escalera Dinámica (+1€ Infinito)

### 📈 Ejemplo de Evolución Paso a Paso

1. **Estado Inicial (Vacío):**
   - El puesto #1 está libre. Precio de inauguración: **1.00€**.
   - _Negocio A_ paga **1.00€** $\rightarrow$ **Negocio A es #1 Diamante**.

2. **Llega el Negocio B:**
   - Para ser #1, el sistema le exige pagar $1.00€ + 1.00€ =$ **2.00€**.
   - _Negocio B_ paga **2.00€** $\rightarrow$ **Negocio B pasa a ser #1**.
   - **Negocio A baja automáticamente al puesto #2**.

3. **Llega el Negocio C:**
   - Para ser #1, debe pagar $2.00€ + 1.00€ =$ **3.00€**.
   - _Negocio C_ paga **3.00€** $\rightarrow$ **Negocio C pasa a ser #1**.
   - **Negocio B baja al puesto #2**.
   - **Negocio A baja al puesto #3**.

4. **Escenario de Rivalidad Extrema (El Efecto "50k + 1"):**
   - Supongamos que la subasta ha progresado tras cientos de pujas y el actual #1 pagó **50.000€**.
   - El _Negocio A_ (que empezó pagando 1€) ha quedado desplazado al fondo de la lista.
   - En cualquier momento, _Negocio A_ (o cualquier otro titular) puede pagar **50.001€** (+1.00€ sobre el récord) y **volver a catapultarse directamente al puesto #1 Diamante**, desplazando a todos los demás participantes un escalón hacia abajo.

```
       [ PUJA: 50.001€ ] ───►  👑 #1 DIAMANTE (Nuevo Líder)
                                  │ (desplaza hacia abajo)
       [ PUJA: 50.000€ ] ───►  🥇 #2 ORO
                                  │
       [ PUJA: 49.999€ ] ───►  🥈 #3 PLATA
                                  │
       [ PUJA:   ...   ] ───►  🎖️ #4 a #N (Cola Infinita)
```

---

## 📐 3. Formulación Matemática y Algoritmo de Ranking

### Fórmula de Siguiente Puja

$$ \text{NextBidPrice} = \begin{cases}
1.00€ & \text{si la lista está vacía o el récord actual es } 0€ \\
\text{CurrentTopBid} + 1.00€ & \text{si existe un titular en el puesto \#1}
\end{cases}$$

### Criterio de Ordenación en BD / Memoria (`rankHonorList`)
Los participantes se ordenan mediante dos claves deterministas:
1. **Criterio Primario:** Importe total aportado en euros (`currentBidEuros`), de mayor a menor.
2. **Criterio Secundario (Desempate):** Marca de tiempo de postulación más antigua (`nominatedAt`).

$$\text{Posición}(S_i) < \text{Posición}(S_j) \iff \text{Bid}(S_i) > \text{Bid}(S_j) \lor (\text{Bid}(S_i) = \text{Bid}(S_j) \land \text{Time}(S_i) < \text{Time}(S_j))$$

---

## 🛡️ 4. Filtro Ético Inmutable (Zero Fake Data & GR-11)

Para evitar que el dinero compre credibilidad falsa o posicione negocios fraudulentos, el motor aplica una barrera estricta antes de aceptar cualquier postulación:

```typescript
export function isEligibleForHonorSpot(service: ServiceItem): { eligible: boolean; reason?: string } {
  // 1. Debe estar abierto y operativo
  if (service.status !== "open") {
    return { eligible: false, reason: "El negocio no se encuentra actualmente abierto y operativo." };
  }

  // 2. Calidad contrastada: Mínimo 80% en su índice de confianza algorítmica
  const score = service.confidenceScore ?? (service.verified ? 90 : 50);
  if (score < 80) {
    return { eligible: false, reason: `Confianza insuficiente (${score}%). Se requiere un mínimo del 80%.` };
  }

  return { eligible: true };
}
```

---

## 🏛️ 5. Las 6 Categorías Gremiales de Honor en Mallorca

La plataforma no tiene solo una lista general; cuenta con **6 listas temáticas independientes**, permitiendo a cada gremio tener su propia batalla sana por el primer puesto:

| ID de Lista | Nombre del Cuadro de Honor | Sector Gremial | Puja Mínima |
| :--- | :--- | :--- | :--- |
| `elite-balear` | 🏆 **Élite Balear: Referentes de Confianza** | Top Global de la Isla | +1.00€ |
| `maestros-instalaciones` | ⚡ **Maestros del Gremio & Instalaciones** | Fontanería, Electricidad, Reformas | +1.00€ |
| `artesanos-sabor` | 🍷 **Artesanos del Sabor & Producto Local** | Bodegas, Hornos, Gastronomía Km0 | +1.00€ |
| `excelencia-nautica` | ⚓ **Excelencia Náutica & Chárter** | Marinas, Yates, Escuelas de Vela | +1.00€ |
| `bienestar-salud` | 🌿 **Santuarios de Bienestar & Salud** | Spas, Yoga, Centros Deportivos | +1.00€ |
| `emprendimientos-emergentes` | 🚀 **Emprendimientos Emergentes** | Nuevas startups y proyectos locales | +1.00€ |

---

## 💳 6. Plataforma de Pagos y Transparencia Fiscal

1. **Pasarelas Aceptadas:**
   - 💳 Tarjetas de crédito/débito (Visa, Mastercard, American Express).
   - 📱 Bizum instantáneo para pagos locales españoles.
   - 🍏 Apple Pay y Google Pay con autorización biométrica de 1 clic.
2. **Facturación Automática:**
   - Emisión instantánea de factura legal con desglose del 21% de IVA para deducción fiscal de autónomos y empresas.
3. **Visibilidad Pública Inmediata:**
   - Tan pronto como la pasarela confirma el pago (+1€), la base de datos reordena el ranking al instante y el nuevo líder aparece coronado con el borde Diamante en portada y en la página `/cuadro-de-honor`.
$$
