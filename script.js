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
    const categoriaId = document.getElementById('categoria').value;
    const antAnios = parseInt(document.getElementById('antiguedad').value) || 0;
    const esAfiliado = document.getElementById('afiliado').value;
    const h50Count = parseInt(document.getElementById('h50').value) || 0;
    const h100Count = parseInt(document.getElementById('h100').value) || 0;
    const hNocturnasCount = parseInt(document.getElementById('hNocturnas').value) || 0;
    const diasVac = parseInt(document.getElementById('diasVacaciones').value) || 0;

    const escalas = {
        marzo: { basico: 884800, pres: 165000, viatico: 473800, norem: 25000, plusVac: 18952 },
        abril: { basico: 893650, pres: 165000, viatico: 480500, norem: 25000, plusVac: 19220 },
        mayo:  { basico: 902600, pres: 165000, viatico: 487000, norem: 30000, plusVac: 19480 },
        junio: { basico: 911650, pres: 165000, viatico: 498000, norem: 70000, plusVac: 19920 }
    };

    let data = escalas[mes];

    // 1. Calculamos el Básico según categoría
    let plusCategoria = 0;
    let basePresentismo = data.pres;
    if (categoriaId === "vigilador_principal") {
        plusCategoria = 118000;
        basePresentismo = 193100;
    } else if (categoriaId === "adm_control") {
        plusCategoria = 87200;
        basePresentismo = 186100;
    }

    const basicoConCategoria = data.basico + plusCategoria;
    
    // 2. Antigüedad (1% por año sobre el básico con categoría)
    const montoAntiguedad = (basicoConCategoria * 0.01) * antAnios;

    // 3. VALOR HORA AJUSTADO (Base para Extras y Nocturnas)
    // Aquí sumamos Antigüedad y Presentismo a la base para que las nocturnas "se ajusten"
    const sueldoConformado = basicoConCategoria + montoAntiguedad + basePresentismo;
    const baseValorHora = sueldoConformado / 200;

    // 4. CÁLCULO DE ADICIONALES[cite: 1, 2]
    const montoH50 = baseValorHora * 1.5 * h50Count;
    const montoH100 = baseValorHora * 2 * h100Count;
    
    // Plus Nocturno: Se aplica un 0.1333 (13,33%) sobre la hora ya ajustada por antigüedad[cite: 1, 2]
    const montoNocturno = (baseValorHora * 0.1333) * hNocturnasCount;

    const diasParaPlus = diasVac > 21 ? 21 : diasVac;
    const totalPlusVacacional = diasParaPlus * data.plusVac;

    // 5. TOTAL BRUTO Y DESCUENTOS[cite: 1]
    const totalBruto = sueldoConformado + montoH50 + montoH100 + montoNocturno + totalPlusVacacional;

    let porcentajeDesc = 0.18; 
    if (esAfiliado === "si") porcentajeDesc += 0.02; 
    const totalDescuentos = totalBruto * porcentajeDesc;

    // 6. NETO FINAL[cite: 5]
    const netoFinal = (totalBruto - totalDescuentos) + data.viatico + data.norem;

    // 7. MOSTRAR RESULTADOS
    document.getElementById('res-basico').innerText = "$" + basicoConCategoria.toLocaleString('es-AR');
    document.getElementById('res-ant').innerText = "$" + montoAntiguedad.toLocaleString('es-AR');
    document.getElementById('res-pres').innerText = "$" + basePresentismo.toLocaleString('es-AR');
    document.getElementById('res-extras').innerText = "$" + (montoH50 + montoH100).toLocaleString('es-AR');
    document.getElementById('res-nocturnas').innerText = "$" + montoNocturno.toLocaleString('es-AR', {maximumFractionDigits: 2});
    document.getElementById('res-plusvac').innerText = "$" + totalPlusVacacional.toLocaleString('es-AR');
    document.getElementById('res-desc').innerText = "- $" + totalDescuentos.toLocaleString('es-AR');
    document.getElementById('res-viatico').innerText = "$" + data.viatico.toLocaleString('es-AR');
    document.getElementById('res-norem').innerText = "$" + data.norem.toLocaleString('es-AR');
    document.getElementById('res-total').innerText = "$" + netoFinal.toLocaleString('es-AR', {minimumFractionDigits: 2});

    document.getElementById('resultado-detalle').style.display = 'block';
}