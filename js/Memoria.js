// Memoria HTML5, js, css
// Version 0.1 Octubre 2015
// Héctor M Ochoa
// Hercoka Games

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

$(document).ready(main);
var cartas;
var fondo;
var frente;
var anchoCarta = 120;
var altoCarta = 160;
var Pantalla = 'Inicio';
var teclado = {};

function main()
{
	fondo = new Image();
	backcard = new Image();
	frente = new Image();

	fondo.src = 'img/backGame.png';
	frente.src = 'img/bobEsponja.jpg';
	backcard.src = 'img/backCard.jpg';

	fondo.onload = function(){
		var intervalo = window.setInterval(frameLoop, 100);
		var intervalo2 = window.setInterval(detectaTecla, 120);
	}

	agregarEventosTeclado();

}

function agregarEventosTeclado(){

	agregarEventos(document, "keydown", function(e){
		teclado[e.keyCode] = true;
	});

	agregarEventos(document, "keyup", function(e){
		teclado[e.keyCode] = false;
	});

	function agregarEventos(elemento, nombreEvento, funcion){
		if(elemento.addEventListener)
		{
			elemento.addEventListener(nombreEvento, funcion, false);
		}
		else if(elemento.attachEvent){
			elemento.attachEvent(nombreEvento, funcion);
		}
	}
}

function frameLoop(){

	switch (Pantalla){
		case 'Inicio':
			PantallaDeInicio();
			break;
		case 'Juego':
			PantallaDeJuego();
			break;
		case 'Juego Terminado':
			PantallaFinJuego();
			break;
	}

}

function detectaTecla(){
	// F2
	if ((Pantalla == 'Inicio') || (Pantalla == 'Juego Terminado'))
	{
		if (teclado[113]) {
			iniciarJuego();
			Pantalla = 'Juego';
		}
	}
}

function iniciarJuego(){
	cartas = Cartas();	
	cartas.generarCartas();

	canvas.addEventListener('click', function(evt) {
		var Pos = getMousePos(evt);
		cartas.seleccionDeCarta(Pos);
	}, false);

}

function PantallaFinJuego(){
	// Dibujar Fondo
	ctx.drawImage(fondo, 0, 0);

	var mensaje1 = 'Felicidades Gano el Juego';
	var mensaje2 = 'Presiona F2 para reiniciar';

	ctx.save();
	ctx.fillStyle = 'black';
	ctx.font = '1em Verdana';
	ctx.fillText(mensaje1, 300, 200);
	ctx.fillText(mensaje2, 300, 220);
	ctx.restore();
}

function PantallaDeInicio(){

	// Dibujar Fondo
	ctx.drawImage(fondo, 0, 0);

	var mensaje = 'Presiona F2 para iniciar'

	ctx.save();
	ctx.fillStyle = 'black';
	ctx.font = '1em Verdana';
	ctx.fillText(mensaje, 300, 200);
	ctx.restore();

}

function PantallaDeJuego(){

	// Dibujar Fondo
	ctx.drawImage(fondo, 0, 0);

	// Dibujar Cartas
	cartas.dibujaCarta();
}

function Cartas(){
	return {
		cartas: [],
		CartasSeleccionadas: 0,
		generarCartas: function() {
			var cnt = 0;

			for (var i = 0; i < 5; i++) {
				var val = 0;

				cnt++;
				val = GetValCard(this.cartas);
				var carta1 = this.agregarCarta(cnt, val, anchoCarta, altoCarta);
				this.cartas.push(carta1);

				cnt++;
				val = GetValCard(this.cartas);
				var carta2 = this.agregarCarta(cnt, val, anchoCarta, altoCarta);
				this.cartas.push(carta2);
			}

		},
		agregarCarta: function(Id, Val, Width, Heigth){
			return{
				id: Id,
				valor: Val,
				x: 0,
				y:0,
				ancho: Width,
				alto: Heigth,
				seleccionada: 'No'
			};
		},
		dibujaCarta: function() {
			var posY = 0;
			var posX = 0;
			var margen = 40;
			var espaciado = 30;

			for(var i = 0; i < 10; i++){

				var carta = this.cartas[i];
				var ren = Math.floor(i/5);
				var PosY = (200 * ren) + margen;
				var col = (i * (carta.ancho + espaciado));
				var dct = (ren * ((ren * 5) * (carta.ancho + espaciado)));
				posX = (margen + col - dct);

				carta.x = posX;
				carta.y = PosY;

				// ctx.fillStyle = 'black';
				// ctx.font = '1em Verdana';

				if (carta.seleccionada == 'Si')
				{
					var posren = Math.floor(carta.valor / 4);
					var posXIni = ((carta.valor - (4 * posren)) * 300);
					var posYIni = (posren * 410);

					ctx.drawImage(frente, posXIni, posYIni, 300, 400, posX, PosY, carta.ancho, carta.alto);
					//ctx.fillText(carta.valor, posX, PosY);
				}
				else if (carta.seleccionada == 'No')
				{
					ctx.drawImage(backcard, 0, 0, 900, 1260, posX, PosY, carta.ancho, carta.alto);			
					//ctx.fillText(carta.valor, posX, PosY);
				}
			}
		},
		seleccionDeCarta: function(Pos){

			if (this.CartasSeleccionadas < 2)
			{
				for(i in this.cartas) {
					var carta = this.cartas[i];

					if ((carta.x <= Pos.x && ((carta.x + carta.ancho) >= Pos.x)) &&
						(carta.y <= Pos.y && ((carta.y + carta.alto) >= Pos.y)))
					{
						if(carta.seleccionada == 'No')
						{
							carta.seleccionada = 'Si';
							this.CartasSeleccionadas += 1;
							if (this.CartasSeleccionadas == 2)
							{
								setTimeout(this.evaluarCartasSeleccionadas, 1000);
							}
						}
					}

				}
			}
		},
		evaluarCartasSeleccionadas: function(){

			var carSel = this.cartas.cartas.filter(function(cr){return cr.seleccionada == 'Si'});

			if (carSel[0].valor == carSel[1].valor){
				carSel[0].seleccionada = 'Encontrada'; 
				carSel[1].seleccionada = 'Encontrada';

				var pendientes = this.cartas.cartas.filter(function(cr){return cr.seleccionada != 'Encontrada'});
				if (pendientes.length == 0)
				{
 					Pantalla = 'Juego Terminado';
				}				

			}
			else
			{
				carSel[0].seleccionada = 'No'; 
				carSel[1].seleccionada = 'No';
			}

			cartas.CartasSeleccionadas = 0;

		}
	}
}

function GetValCard(lst){
	var existe = 0;
	var val = 0;

	do 
	{
		val =  Math.floor((Math.random() * 5));
		existe = lst.filter(function(cr){return cr.valor == val});
	}
	while (existe.length > 1)

	return val;
}


function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
	}
}