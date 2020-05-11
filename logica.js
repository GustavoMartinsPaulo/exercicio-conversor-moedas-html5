function carregaSelectMenu() {
	$.ajax({
		url: 'https://api.exchangeratesapi.io/latest',
		type: "GET",
		dataType: "json",
		success: function (data) {
			$("#moeda_destino").append(`<option value="EUR">EUR</option>`);
			
			$.each(data.rates, function (index,value) {
				$("#moeda_destino").append(`<option value="${index}">${index}</option>`);
				
			});
			console.log(data.rates);
		},
		error: function (error) {
			console.log(`Erro ${error}`);
		}
	});
};

function verifica () {
	var oOptions = [];
	var bRetorno = true;
	var bMoedaNaoSuportada = true;
	var sMoedaOrigem = $("#moeda_origem").val().toUpperCase();
	
	oOptions = $("select.custom-select").children("option");
	$.each(oOptions, function(index){
		if(oOptions[index].value === sMoedaOrigem){
			bMoedaNaoSuportada = false;
		}
	});
	if(bMoedaNaoSuportada===true){
		alert("A moeda base digitada (" + sMoedaOrigem + ") não é suportada pelo algoritmo.\nPor favor selecione uma moeda válida.") 
		bRetorno = false;
	}
	
	oOptions = $("select.custom-select").children("option:selected");
	$.each(oOptions, function(index){
		if(oOptions[index].value === sMoedaOrigem){
			alert("O campo de moeda destino não pode ter a moeda base selecionada.\nCorrija a seleção ou altere a moeda base para alguma opção não selecionada.");
			bRetorno = false;
		}
	});
	return bRetorno;
};

function capturaParametros (nome) {
   var oParametros = [];
   var sTokens;
   var sRegex = /[?&]?([^=]+)=([^&]*)/g;

   while (sTokens = sRegex.exec(location.search)) { 
		if (decodeURIComponent(sTokens[1]) == nome){
			oParametros.push(decodeURIComponent(sTokens[2]));
		}
   }
   if(oParametros.length === 1){
   	return oParametros[0];
   }else{
   	return oParametros;
   }
};

function callBack(response) {
	var sMoedaDestino = capturaParametros('moeda_destino');
	var sValorOrigem = capturaParametros('valor_origem');
	var sExchangeRate = response.rates[sMoedaDestino];
	
	$("#valor_inserido").val(sValorOrigem);
	
	$.each(response.rates, function (index,value) {
		var sValorConvertido = (sValorOrigem * value).toFixed(2);
		$(".table tbody").append(`<tr>
								<td>${sValorConvertido}</td>
								<td>${index}</td>
							</tr>`);
	});
};

function chamaAPI () {
	
	var sMoedaOrigem, sMoedaDestino, sDataCotacao, sValorOrigem, sUrl;
    
    sValorOrigem = capturaParametros('valor_origem');
    sMoedaOrigem = capturaParametros('moeda_origem');
    sMoedaOrigem = sMoedaOrigem.toUpperCase();
    sMoedaDestino = capturaParametros('moeda_destino');
    sDataCotacao = capturaParametros('data_cotacao');
    
    if(sDataCotacao === ""){
    	sUrl = "https://api.exchangeratesapi.io/latest" + "?base=" + sMoedaOrigem + "&symbols=" + sMoedaDestino;
    	$("#subtitulo").text("Conversão de " + sValorOrigem + " " + sMoedaOrigem + " na cotação de hoje:");
    }else{
    	sUrl = "https://api.exchangeratesapi.io/" + sDataCotacao + "?base=" + sMoedaOrigem + "&symbols=" + sMoedaDestino;
    	$("#subtitulo").text("Conversão de " + sValorOrigem + " " + sMoedaOrigem + " na cotação de " + sDataCotacao +":");
    }

	var oJson = {};
	
	$.ajax({
    url: sUrl,
    type: "GET",
    dataType: "json",
    success: callBack,
    error: function (error) {
        alert("Erro: " + error.responseJSON["error"] + "\n Por favor, volte e tente novamente.");
    }
});

};