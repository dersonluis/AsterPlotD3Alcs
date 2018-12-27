# AsterPlotD3Alcs for QlikSense Extension
O gráfico de Aster é do tipo fatias de pizza com comprimentos relativos aos pesos de cada uma de suas fatias que se estendem até às bordas da circunferência do gráfico.


**AsterPlotD3Alcs** é um upgrade do Projeto adaptado para QlikSense Extension: [D3 Visualization Library for Qlik Sense](https://github.com/skokenes/Qlik-Sense-D3-Visualization-Library) e [Ben Best’s Blocks](http://bl.ocks.org/bbest/2de0e25d4840c68f2db1).



### PRINCIPAIS CARACTERÍSTICAS:
- Cálculo valor central do gráfico: somatório dos pesos de cada fatia que compõe o gráfico.
- Junção de fatias menores numa só fatia/top dos maiores resultados.
- Opção de range de paleta de cores (Qlik Sense).
- Opção de legenda lateral do gráfico.



### ENTRADAS DE DADOS - QlikSense
*AsterPlotD3Alcs* é populado com, basicamente 01 dimensão e 01 medida.

[![](https://github.com/dersonluis/AsterPlotD3Alcs/blob/master/dadosSense.png)](https://github.com/dersonluis/AsterPlotD3Alcs/blob/master/dadosSense.png)



### CONFIGURAÇÕES
[![](https://github.com/dersonluis/AsterPlotD3Alcs/blob/master/options.png)](https://github.com/dersonluis/AsterPlotD3Alcs/blob/master/options.png)

* Legend

  Seta a exibição ou não da legenda relativa ao *AsterPlot*.

* Range of Colors

  Personalização de cores para Dimensões que compõem o *AsterPlot*.

  Valor padrão: *#98abc5,#8a89a6,#7b6888,#6b486b,#a05d56,#d0743c,#ff8c00*

* Max Items to Render

  Indica a quantidades de itens serão renderizadas no gráfico.
  
  ```
  if MaxItems == 0
    >> renderiza todos os items
  else
    >> agrupa os demais itens atribuindo a estes o label::Others
  ```
  
  [![](https://github.com/dersonluis/AsterPlotD3Alcs/blob/master/maxItens.png)](https://github.com/dersonluis/AsterPlotD3Alcs/blob/master/maxItens.png)



### EXEMPLO FORMATO DE DADOS

```javascript
[alcs]:
  Load * Inline
  [
    id,label
    1,LabA
    2,LabB
    3,LabE
    4,LabA
    5,LabC
    6,LabA
    7,LabC
    8,LabF
    9,LabF
    10,LabA
    11,LabD
    12,LabA
    13,LabA
    14,LabG
    15,LabB
  ](delimiter is ',');
```

[![](https://github.com/dersonluis/AsterPlotD3Alcs/blob/master/data.png)](https://github.com/dersonluis/AsterPlotD3Alcs/blob/master/data.png)
