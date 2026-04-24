function irACalcular() {
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('pantalla-calculo').style.display = 'block';
    window.scrollTo(0,0);
}

function volverInicio() {
    document.getElementById('pantalla-calculo').style.display = 'none';
    document.getElementById('pantalla-inicio').style.display = 'block';
}
function realizarCalculo() {
    const mes = document.getElementById('mes-paritaria').value;
    const categoriaNombre = document.getElementById('categoria').options[document.getElementById('categoria').selectedIndex].text;
    const antAnios = parseInt(document.getElementById('antiguedad').value) || 0;
    const esAfiliado = document.getElementById('afiliado').value;
    const h50Count = parseInt(document.getElementById('h50').value) || 0;
    const h100Count = parseInt(document.getElementById('h100').value) || 0;

    // --- ESCALAS OFICIALES ACTA 2026 (Anexo) ---
    // Datos extraídos de las tablas para "Vigilador General"
    let escalas = {
        marzo: { basico: 884800, pres: 165000, viatico: 473800, norem: 25000 },
        abril: { basico: 893650, pres: 165000, viatico: 480500, norem: 25000 },
        mayo:  { basico: 902600, pres: 165000, viatico: 487000, norem: 30000 },
        junio: { basico: 911650, pres: 165000, viatico: 498000, norem: 70000 }
    };

    let data = escalas[mes];

    // Ajuste por categoría (Diferencia de básico según tabla)
    // Ejemplo: Vigilador Principal vs General
    let plusCategoria = 0;
    if (categoriaNombre === "Vigilador Principal") {
        // En mayo: 1.020.600 - 902.600 = 118.000 de diferencia en básico
        plusCategoria = 118000; 
        data.pres = 193100; // El presentismo también sube según tabla
    } else if (categoriaNombre === "Adm. de Control") {
        plusCategoria = 87200;
        data.pres = 186100;
    }

    const basicoReal = data.basico + plusCategoria;

    // --- CÁLCULOS REMUNERATIVOS ---
    const montoAntiguedad = (basicoReal * 0.01) * antAnios; // 1% por año
    const presentismo = data.pres; // Valor fijo según tabla del acta
    
    // Base para Horas Extras (Basico + Ant + Pres)
    const baseCalculo = basicoReal + montoAntiguedad + presentismo;
    const valorHoraBase = baseCalculo / 200;
    
    const montoH50 = valorHoraBase * 1.5 * h50Count;
    const montoH100 = valorHoraBase * 2 * h100Count;

    const totalBruto = baseCalculo + montoH50 + montoH100;

    // --- RETENCIONES (DESCUENTOS) ---
    // Jubilación 11%, Ley 19032 3%, Obra Social 3%, FAS/Aporte 1% (Cláusula 5ta) = 18% base
    let porcentajeDesc = 0.18; 
    if (esAfiliado === "si") porcentajeDesc += 0.02; // Cuota Sindical
    
    const totalDescuentos = totalBruto * porcentajeDesc;

    // --- NETO FINAL ---
    const netoFinal = (totalBruto - totalDescuentos) + data.viatico + data.norem;

    // --- DESGLOSE EN PANTALLA ---
    document.getElementById('res-basico').innerText = "$" + basicoReal.toLocaleString('es-AR');
    document.getElementById('res-ant').innerText = "$" + montoAntiguedad.toLocaleString('es-AR');
    document.getElementById('res-pres').innerText = "$" + presentismo.toLocaleString('es-AR');
    document.getElementById('res-extras').innerText = "$" + (montoH50 + montoH100).toLocaleString('es-AR');
    document.getElementById('res-desc').innerText = "- $" + totalDescuentos.toLocaleString('es-AR');
    document.getElementById('res-viatico').innerText = "$" + data.viatico.toLocaleString('es-AR');
    document.getElementById('res-norem').innerText = "$" + data.norem.toLocaleString('es-AR');
    document.getElementById('res-total').innerText = "$" + netoFinal.toLocaleString('es-AR', {minimumFractionDigits: 2});

    document.getElementById('resultado-detalle').style.display = 'block';
}






