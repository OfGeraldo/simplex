const I_WEIGHT = 0;
const I_VALUE = 1;

var itens = [];

//Exibe mensagem de Erro
function errorMessage(mensagem){
  //exibe mensagem
  var message = $("<div></div>").attr("class", "ui negative message");
  var close = $("<i></i>").attr("class","close icon");
  var header = $("<div>"+mensagem+"</div>").attr("class","header");
  message.append(close, header);

  //Fecha errorMessage
  $('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;
}

// Adiciona um item na tabela
function addItem() {
  setCapacity()

  var txtPeso = document.getElementById('txtPeso');
  var txtValor  = document.getElementById('txtValor');

  var peso = Number(txtPeso.value);
  var valor  = Number(txtValor.value);

  if(peso <= 0)
  {
    errorMessage("O peso deve ser um valor maior que zero!");
    return;
  }

  if(valor < 0)
  {
    errorMessage("O valor deve ser positivo!");
    return;
  }

  var item = [peso, valor];

  var itensLength = itens.length;
  itens[itensLength] = item;

  itens.sort(function(x,y) {
    if(x[I_WEIGHT] == y[I_WEIGHT])
      return x[I_VALUE] > y[I_VALUE];
    else
      return x[I_WEIGHT] > y[I_WEIGHT];
  });

  txtPeso.value = 0;
  txtValor.value = 0;

  printTable();
}
  // Imprime a tabela
function printTable()
{
  $("table").show();
  var table = document.getElementById('tbItens');
  table.lastElementChild.innerHTML = '';

  for(var index = 0; index < itens.length; index++)
  {

    var row = table.lastElementChild.insertRow(index);

    var btnCell = row.insertCell(0);
    var weightCell = row.insertCell(1);
    var valueCell = row.insertCell(2);

    btnCell.innerHTML = '<a onclick="delTableItem(' + index + ')"><i class="circular red trash icon"></i></a>';
    weightCell.innerHTML = itens[index][I_WEIGHT];
    valueCell.innerHTML = itens[index][I_VALUE];
  }

  setCapacity();
}

// Apaga um item da tabela
function delTableItem(index)
{
  if((Number(index) > -1) && (Number(index) < itens.length))
    itens.splice(index, 1);
  else
    alert('Erro inesperado, index inválido: ' + index + '. A tabela foi atualizada, tente novamente!');
  printTable();
}
