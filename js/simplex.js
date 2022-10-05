var loops = 1;
var MAX_LOOPS;
var STOPBYLOOP = MAX_LOOPS + 1;

var FUNCAO = "-3;-2";

function simplex() {
    clear();

    MAX_LOOPS = 3;
    montamatrix();

    while (CondicaoParada() && MaxVoltas()){
        console.log("calculou");
        calculo();
    }
    //Sensibilidade()
    solucao();
}

function montamatrix() {
    //3x e 2x
    var z = FUNCAO.split(";");
    x = [];
    var radios = document.getElementsByName("inputZtype");
    if (radios[0].checked) {
        for (var j = 0; j < z.length; j++) {
            var i = z[j] * -1;
            console.log(i);
            x.push(i);
        }
        z = x;
        console.log(z);
    }
    var restriction = document.querySelectorAll("#subjects .restrictionV");

    matrix = [[]];
    matrix[0][0] = "Linha";

    for (var i = 1; i <= z.length; i++) matrix[0].push("x" + i);
    console.log(matrix[0]);

    for (var i = 1; i <= restriction.length; i++) matrix[0].push("f" + i);
    console.log(matrix[0]);

    matrix[0][matrix[0].length] = "b";
    var countCol = 1;

    for (var i = 1; i <= restriction.length; i++) {
        matrix.push(["f" + i]);
        countCol = 1;
        var basicVars = restriction[i - 1]
            .querySelectorAll("input")[0]
            .value.split(";");
        for (var j = 0; j < z.length; j++) {
            if (basicVars[j]) matrix[i][countCol++] = Number(basicVars[j]);
            else matrix[i][countCol++] = 0;
        }

        for (var j = 0; j < restriction.length; j++) {
            matrix[i][countCol] = Number(
                matrix[i][0] == matrix[0][countCol] ? 1 : 0
            );
            countCol++;
        }

        matrix[i][countCol] = Number(
            restriction[i - 1].querySelectorAll("input")[1].value
        );
    }
    matrix.push(["Z"]);

    countCol = 1;
    for (var i = 0; i < z.length; i++) {
        if (z[i]) matrix[matrix.length - 1][countCol++] = Number(-1 * z[i]);
        else matrix[matrix.length - 1][countCol++] = 0;
    }

    for (var j = 0; j < restriction.length; j++)
        matrix[matrix.length - 1][countCol++] = 0;
    matrix[matrix.length - 1][countCol] = 0;

    printTable("Tabela Inicial");
}

function calculo() {
    var zrow = matrix.length - 1;
    var columnAmount = matrix[zrow].length - 2;
    var rowAmount = matrix.length - 2;
    var entra = 0;
    var minEntraValor = Number.MAX_VALUE;

    for (var i = 1; i <= columnAmount; i++)
        if (matrix[zrow][i] < minEntraValor) {
            entra = i;
            minEntraValor = matrix[zrow][i];
        }

    var sai = 0;
    var iminSaiValor = Number.MAX_VALUE;

    for (var i = 1; i <= rowAmount; i++) {
        var bValue = matrix[i][matrix[0].length - 1];
        var colValue = matrix[i][entra];

        if (colValue <= 0) continue;

        var result = bValue / colValue;
        if (result < iminSaiValor) {
            sai = i;
            iminSaiValor = result;
        }
    }

    if (sai == 0) {
        loops = STOPBYLOOP;
        return;
    }

    console.log("Entra na base: " + matrix[0][entra]);
    console.log("Sai da base:" + matrix[sai][0]);

    matrix[sai][0] = matrix[0][entra];

    var pivo = matrix[sai][entra];

    for (var i = 1; i < matrix[0].length; i++)
        matrix[sai][i] = matrix[sai][i] / pivo;

    for (var row = 1; row < matrix.length; row++) {
        if (row == sai || matrix[row][entra] == 0) continue;

        var fator = -1 * matrix[row][entra];

        for (var column = 1; column < matrix[row].length; column++)
            matrix[row][column] =
                matrix[sai][column] * fator + matrix[row][column];
    }
    console.log("Entrooooooooooooooooooooooooo");
    printTable("Iteração " + loops++);
}

function CondicaoParada() {
    //pega a linha de z
    var zrow = matrix.length - 1;

    //pega a última coluna Z
    var columnAmount = matrix[zrow].length - 1;

    console.table(matrix);

    //verifica se há valor negativo
    for (var i = 1; i < columnAmount; i++) {

        if (matrix[zrow][i] < 0) {
            //ainda há valores negativos
            return true;
        }
    }

    return false; //parar o simplex
}

function MaxVoltas() {
    if (loops > MAX_LOOPS){
            return false;
    }

    return true;
}

function printTable(title) {
    var results = document.getElementById("tables");
    var htmlTitle = '<h3 class="text-center">' + title + "</h3>";
    var table = '<table class="ui teal table">';
    var header = "<thead><tr>";
    for (var col = 0; col < matrix[0].length; col++)
        header += "<th>" + matrix[0][col] + "</th>";
    table += header + "</tr></thead>";
    var body = "<tbody>";
    for (var row = 1; row < matrix.length; row++) {
        var tr = "<tr>";
        for (var col = 0; col < matrix[row].length; col++)
            tr += "<td>" + matrix[row][col] + "</td>";

        body += tr + "</tr>";
    }

    table += body + "</tbody>";
    results.innerHTML += htmlTitle + table + "</table><hr />";
}

function solucao() {
    var outputDiv = document.getElementById("post-optimization");
    var header = '<h4 class="text-center">Questões pós otimização</h4>';
    var paragrafos = "";
    for (var i = 1; i < matrix[0].length - 1; i++) {
        var solucao =
            (matrix[0][i][0] == "x" ? "Produção de " : "Folga da restrição ") +
            matrix[0][i];
        var val = 0;
        for (var rowIndex = 1; rowIndex < matrix.length - 1; rowIndex++)
            if (matrix[0][i] == matrix[rowIndex][0])
                val = matrix[rowIndex][matrix[0].length - 1];
        paragrafos += '<div class="item">' + solucao + " = " + val + "</div>";
    }
    outputDiv.innerHTML =
        "<div class='ui list'>" + header + paragrafos + "</div>";
}