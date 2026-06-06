// Función para alternar visualmente entre paneles de escenarios (Menú Interactiva)
function cambiarEscenario(idEscenario) {
    const paneles = document.querySelectorAll('.escenario-panel');
    paneles.forEach(p => p.style.display = 'none');
    
    document.getElementById(`sc-${idEscenario}`).style.display = 'block';
}

// Función reutilizable para limpiar campos y reiniciar la vista del output
function limpiarFormulario(formId, resId) {
    document.getElementById(formId).reset();
    const cajaRes = document.getElementById(resId);
    cajaRes.textContent = "Los resultados aparecerán aquí.";
    cajaRes.className = "resultado-caja";
}

// 1. ESCENARIO A: CARBURANTES
function calcularCarburante() {
    const inicial = parseFloat(document.getElementById('carb-inicial').value);
    const consumo = parseFloat(document.getElementById('carb-consumo').value);
    const reabasto = parseFloat(document.getElementById('carb-reabastecimiento').value);
    const critico = parseFloat(document.getElementById('carb-critico').value);
    const output = document.getElementById('res-carburante');

    let netoDiario = consumo - reabasto;
    if (netoDiario <= 0) {
        output.innerHTML = "<h4>Estado: Estable</h4><p>El reabastecimiento cubre o supera al consumo diario. La reserva no se agotará.</p>";
        output.className = "resultado-caja estado-normal";
        return;
    }

    let diasHastaCritico = (inicial - critico) / netoDiario;
    let diasHastaAgotar = inicial / netoDiario;

    let mensaje = `Días hasta llegar al nivel crítico: <strong>${Math.max(0, diasHastaCritico).toFixed(1)} días</strong><br>`;
    mensaje += `Días hasta agotarse totalmente: <strong>${diasHastaAgotar.toFixed(1)} días</strong>`;

    output.innerHTML = `<h4>Cálculo de Reserva</h4><p>${mensaje}</p>`;
    
    if (diasHastaCritico <= 3) {
        output.className = "resultado-caja estado-critico";
    } else {
        output.className = "resultado-caja estado-alerta";
    }
}

// 2. ESCENARIO B: ALIMENTOS
function calcularAlimentos() {
    const anterior = parseFloat(document.getElementById('alim-anterior').value);
    const actual = parseFloat(document.getElementById('alim-actual').value);
    const cantidad = parseFloat(document.getElementById('alim-cantidad').value);
    const output = document.getElementById('res-alimentos');

    let incremento = actual - anterior;
    let porcentaje = (incremento / anterior) * 100;
    let gastoAnterior = anterior * cantidad;
    let gastoActual = actual * cantidad;
    let diferenciaTotal = gastoActual - gastoAnterior;

    output.innerHTML = `
        <h4>Resultados de Inflación:</h4>
        <p>Incremento por unidad: <strong>${incremento.toFixed(2)} Bs</strong></p>
        <p>Porcentaje de aumento: <strong>${porcentaje.toFixed(1)}%</strong></p>
        <p>Gasto mensual anterior: <strong>${gastoAnterior.toFixed(2)} Bs</strong></p>
        <p>Gasto mensual actual: <strong>${gastoActual.toFixed(2)} Bs</strong></p>
        <p>Gasto adicional: <strong style="color:red;">+${diferenciaTotal.toFixed(2)} Bs</strong></p>
    `;
    output.className = porcentaje > 20 ? "resultado-caja estado-critico" : "resultado-caja estado-alerta";
}

// 3. ESCENARIO C: TRANSPORTE
function calcularTransporte() {
    const normal = parseFloat(document.getElementById('trans-normal').value);
    const desvio = parseFloat(document.getElementById('trans-desvio').value);
    const costoKm = parseFloat(document.getElementById('trans-costo').value);
    const viajes = parseFloat(document.getElementById('trans-viajes').value);
    const output = document.getElementById('res-transporte');

    let costoNormalViaje = normal * costoKm;
    let costoDesvioViaje = desvio * costoKm;
    let adicionalSemanal = (costoDesvioViaje - costoNormalViaje) * viajes;

    output.innerHTML = `
        <h4>Impacto en Transporte:</h4>
        <p>Costo normal por viaje: <strong>${costoNormalViaje.toFixed(2)} Bs</strong></p>
        <p>Costo con desvío por viaje: <strong>${costoDesvioViaje.toFixed(2)} Bs</strong></p>
        <p>Gasto EXTRA total por semana: <strong>${adicionalSemanal.toFixed(2)} Bs</strong></p>
    `;
    output.className = adicionalSemanal > 50 ? "resultado-caja estado-critico" : "resultado-caja estado-alerta";
}

// 4. ESCENARIO D: PRESUPUESTO COMPRAS
function calcularCompras() {
    const presupuesto = parseFloat(document.getElementById('comp-presupuesto').value);
    const total = parseFloat(document.getElementById('comp-total').value);
    const output = document.getElementById('res-compras');

    if (presupuesto >= total) {
        let saldo = presupuesto - total;
        output.innerHTML = `<h4>¡Presupuesto Alcanza!</h4><p>Te sobra un saldo de: <strong>${saldo.toFixed(2)} Bs</strong></p>`;
        output.className = "resultado-caja estado-normal";
    } else {
        let faltante = total - presupuesto;
        output.innerHTML = `<h4>❌ Presupuesto Insuficiente</h4><p>Te hace falta un monto de: <strong style="color:red;">${faltante.toFixed(2)} Bs</strong></p>`;
        output.className = "resultado-caja estado-critico";
    }
}

// 5. ESCENARIO E: RUMORES DE ESCASEZ
function calcularRumores() {
    const demandaNormal = parseFloat(document.getElementById('rum-demanda').value);
    const aumentoPorcentaje = parseFloat(document.getElementById('rum-aumento').value);
    const stock = parseFloat(document.getElementById('rum-stock').value);
    const output = document.getElementById('res-rumores');

    let nuevaDemanda = demandaNormal + (demandaNormal * (aumentoPorcentaje / 100));
    let balance = stock - nuevaDemanda;

    if (balance >= 0) {
        output.innerHTML = `<h4>Stock Suficiente</h4><p>Nueva demanda (por pánico): <strong>${nuevaDemanda} u</strong>.<br>Stock remanente: <strong>${balance} u</strong>.</p>`;
        output.className = "resultado-caja estado-normal";
    } else {
        output.innerHTML = `<h4>⚠️ Alerta de Desabastecimiento</h4><p>La demanda subió a <strong>${nuevaDemanda} u</strong> superando el stock por <strong style="color:red;">${Math.abs(balance)} unidades</strong>.</p>`;
        output.className = "resultado-caja estado-critico";
    }
}

// 6. ESCENARIO F: PODER ADQUISITIVO
function calcularAdquisitivo() {
    const ingreso = parseFloat(document.getElementById('adq-ingreso').value);
    const anterior = parseFloat(document.getElementById('adq-anterior').value);
    const actual = parseFloat(document.getElementById('adq-actual').value);
    const output = document.getElementById('res-adquisitivo');

    let inflacionGasto = actual - anterior;
    let perdidaPoder = (inflacionGasto / ingreso) * 100;
    let saldoRestante = ingreso - actual;

    output.innerHTML = `
        <h4>Pérdida de Capacidad de Compra:</h4>
        <p>Tu gasto fijo mensual subió: <strong>${inflacionGasto.toFixed(2)} Bs</strong></p>
        <p>Pérdida del Poder Adquisitivo: <strong>${perdidaPoder.toFixed(1)}% del sueldo</strong></p>
        <p>Dinero libre remanente: <strong>${saldoRestante.toFixed(2)} Bs</strong></p>
    `;
    output.className = perdidaPoder > 15 ? "resultado-caja estado-critico" : "resultado-caja estado-alerta";
}

// CARGAR LOS CASOS DE ESTUDIO DEL PDF AUTOMÁTICAMENTE
function cargarCasoEstudio(tipo, valores) {
    cambiarEscenario(tipo);
    
    if (tipo === 'carburante') {
        document.getElementById('carb-inicial').value = valores[0];
        document.getElementById('carb-consumo').value = valores[1];
        document.getElementById('carb-reabastecimiento').value = valores[2];
        document.getElementById('carb-critico').value = valores[3];
        calcularCarburante();
    } else if (tipo === 'alimentos') {
        document.getElementById('alim-anterior').value = valores[0];
        document.getElementById('alim-actual').value = valores[1];
        document.getElementById('alim-cantidad').value = valores[2];
        calcularAlimentos();
    } else if (tipo === 'transporte') {
        document.getElementById('trans-normal').value = valores[0];
        document.getElementById('trans-desvio').value = valores[1];
        document.getElementById('trans-costo').value = valores[2];
        document.getElementById('trans-viajes').value = valores[3];
        calcularTransporte();
    } else if (tipo === 'compras') {
        document.getElementById('comp-presupuesto').value = valores[0];
        document.getElementById('comp-total').value = valores[1];
        calcularCompras();
    } else if (tipo === 'rumores') {
        document.getElementById('rum-demanda').value = valores[0];
        document.getElementById('rum-aumento').value = valores[1];
        document.getElementById('rum-stock').value = valores[2];
        calcularRumores();
    }
}
