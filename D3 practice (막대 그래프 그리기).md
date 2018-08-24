# D3 practice (막대 그래프 그리기)

### D3 (Data Driven Document) 란?

웹브라우저 상에서 동적이고 정보 시각화를 구현하기 위한 자바스크립트 라이브러리이다.

[공식홈페이지 (https://d3js.org/)](https://d3js.org/)



### 시작하기전에

본 문서는 youtube d3vienno 강좌를 듣고 정리한 내용이다. 그리고 나의 주관적인 생각이 많이 들어가거나 사용하는 언어로 잘못된 표현이 있을수도 있다.

[강좌링크](https://www.youtube.com/channel/UCNYL0ZF2j8-OSGZ4iHBLNPA)

`html` 파일을 하나 만든 후 `<head>` 사이에 

```html
<script src="http://d3js.org/d3.v3.min.js"></script>
```

추가 하면 d3를 사용할 수 있다.



### select 

말그대로 선택한다는 뜻이다.  `jquery` 와 문법이 많이 비숫하다. 

```js
d3.select("body")
```

보통 혼자 쓰이지 않고 `append` 와 함께  사용된다.



### append

`select` 로 선택된 요소에 자식요소 (tag) 를 추가 시킬수 있다.

```js
d3.select("body").append("svg")
```



### attr 

`attribute`의 줄인말이다. 해당 태그의 속성을 추가 시킬수 있다.( 넓이, 높이, 색깔, 윤곽선 등등... )

```js
var canvas = 	d3.select("body")
				.append("svg")
				.attr("width", 500)
				.atrr("height", 500);
```



### svg (Scalable Vector Graphics)

해석 그대로 확장 가능한 벡터 그래픽이다. 그래픽을 마크업 하기 위한 특수 언어이다.

원이나 다각형, 선등을 지원해준다.

[w3school svg tutorial](https://www.w3schools.com/graphics/svg_intro.asp)



### visualizing data

배열에 담긴 데이터들을 가시성있는 막대그래프로 표현해본다.

이전 코드에서 이어서 진행 하겠다. 

현재 ` canvas` 라는 변수 안에 가로 500, 세로 500의 `svg` 태그를 만들어 놓았다.

```js
var dataArray = [20, 30, 50];

var canvas = 	d3.select("body")
				.append("svg")
				.attr("width", 500)
				.atrr("height", 500);

var bars = 	canvas.selectAll("rect")
      		.data(dataArray)
      		.enter()
      		.append("rect")
      		.attr("width", function (d) {
				return d * 10;
      		})
      		.attr('height', 50)
      		.attr('y', function (d, i) {
        		return i * 60
      		});
```

* `selectAll("rect")`

  `selectAll("rect")` 은 존재하지 않는`rect ` 요소에 대한 비어있는 참조를 해준다.

*  `data(dataArray)`

  `data(dataArray)`를 통해 존재하지 않는 가상의 `rect` 요소에 `dataArray`에 있는 데이터들을 순차대로 바인딩 해준다.



* `enter()`

  바인딩된 데이터중에 아직 실제 문서 요소를 갖지 못한 것들을 가상의 객체로 만든다.

* `append("rect")`

  enter() 로 생성된 가상의 객체들을 부모 요소의 자식요소로 실제 문서요소로 만들어 준다.



* `.attr("width", function(d) {return d;})`

  d = data

  인자로 data를 받아 data 를 반환하는 함수이므로 dataArray에 있는 값이 width 가 된다.

* `.attr('y', function (d, i) { return i * 60 });`

  d = data

  i = index

  data와 index를 같이 받아 y 값을 index * 60으로 반환



여기까지 했다면 검은 색깔의 막대 그래프가 3개 그려져 있을 것이다.



### scales

`svg `의 크기를 고정으로 하면 만약 자식요소들이 그 크기를 초과하게 되면 데이터가 정확하게 표시되지 않는다

그래서 사용하는 것이 `scale` 이다.

`scale`은 어떤 범위의 숫자를 다른 범위의 숫자로 변경해준다. 예를 들어서 0 부터 5까지 표현할 수 있다면 0부터 500까지 있는 데이터 중에 100 이라면 1과 매칭 시켜준다.

문법을 보자

```js
d3.scale().linear.domain([0, 500]).range([0, 5]);
```

이런식으로 된다. 

`scale` 에는 여러 종류가 있지만 이 문서에서는 `linear` 만 다룬다.

`domain`의 인자로 배열 하나를 받는데 배열안에는 표현하고자 하는 실제 데이터의 범위를 적는다.

`range`도 배열 하나를 인자로 받고 배열 안에는 표현가능한 데이터의 범위를 적는다.

그럼 자동으로 `range` 의 인자들에 맞춰 실제 데이터들이 그려진다.

```js
var witdhScale = 	d3.scale
      				.linear()
      				.domain([0, 60])
      				.range([0, width]);
      
var color =	 d3.scale
      		.linear()
      		.domain([0, 60])
      		.range(["red", "blue"]); // 길이 뿐만 아니라 색상도 범위로 표현 가능하다
      
var bars = 	canvas.selectAll("rect")
      		.data(dataArray)
      		.enter()
      		.append("rect")
      		.attr("width", function (d) {
        		return witdhScale(d);
      		})
      		.attr('height', 50)
      		.attr("fill", function (d) {
        		return color(d);
      		}) //색을 바꿔주는 코드
      		.attr('y', function (d, i) {
        		return i * 60
      		});
```



### groups & axis

그룹은 말그대로 그룹화 시키는 것이다. `svg` 의 태그인 `<g>` 를 통해 `svg` 요소들을 묶을 수 있다. 

`axis` 는 d3 에서 제공하는 축이다.

사용방법을 알아보겠다.



* group

  ```js
  var canvas = 	d3.select("body")
  				.append("svg")
  				.attr("width", width)
  				.attr("height", height)
  				.append("g")
  				.attr("transform", "translate(0, 20)");
  ```

  `g` 태그를 `append` 시키고 `translate`를 이용해 이동시켰다.



* axis

  ```js
  var axis = d3.svg.axis().scale(witdhScale);
  ```

  `svg` 에 `axis`를 그리고 `scale` 을 넘겨주면 적당한 간격으로 축을 만든다. 

  `ticks(int)`를 이용해 간격을 설정할 수도 있다.



  ```js
  canvas.append("g").attr("transform", "translate(0, 300)").call(axis);
  ```

  그 다음 `axis` 를 그릴 요소 (  `<g>` ) 를 만든후 `call` 을 하면 축이 지정한 위치에 그려진다.



### 전체 코드

몇개 수정한 부분이 있지만 기존 코드와 동일한 구조 이다.

* graph.html

```
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="http://d3js.org/d3.v3.min.js"></script>
</head>

<body>
  <script>
    var dataArray = [5, 20, 30, 40, 60];

    var width = 500;
    var height = 500;

    var color = d3.scale
      .linear()
      .domain([0, 60])
      .range(["red", "blue"]);

    var witdhScale = d3.scale
      .linear()
      .domain([0, 60])
      .range([0, width-20]);


    var axis = d3.svg.axis().scale(witdhScale);

    var canvas = d3.select("body").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(10, 20)");

    var bars = canvas.selectAll("rect")
      .data(dataArray)
      .enter()
      .append("rect")
      .attr("width", function (d) {
        return witdhScale(d);
      })
      .attr('height', 50)
      .attr("fill", function (d) {
        return color(d);
      })
      .attr('y', function (d, i) {
        return i * 60
      });

    canvas.append("g").attr("transform", "translate(0, 300)").call(axis);
  </script>
</body>

</html>
```

* 화면

![1535077803573](C:\Users\PAPICO\AppData\Local\Temp\1535077803573.png)















