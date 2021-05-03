/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Author: Fabian Castaño
 * * Institution: University of Antioquia
 * * Course: Laboratorio avanzado 3
 * ***********************************************************/

// Ejemplo de como realizar Plots en la simulacion

function setup() {
	createCanvas(800, 400);
	// Create a new plot and set its position on the screen
	points = [];
	seed = 100 * random();

	for (i = 0; i < 100; i++) {
		points[i] = new GPoint(i, 10 * noise(0.1 * i + seed));
	}
	plot = new GPlot(this);
	plot.setPos(0, 0);
	plot.setOuterDim(400, height);

	// Add the points
	plot.setPoints(points);

	// Set the plot title and the axis labels
	plot.setTitleText("A very simple example");
	plot.getXAxis().setAxisLabelText("x axis");
	plot.getYAxis().setAxisLabelText("y axis");

	// Draw it!
	plot.defaultDraw();

	points = [];
	seed = 100 * random();
	for (i = 0; i < 100; i++) {
		points[i] = new GPoint(i, 10 * noise(0.1 * i + seed));
	}

	plot2 = new GPlot(this);
	plot2.setPos(400, 0);
	plot2.setOuterDim(400, height);

	// Add the points
	plot2.setPoints(points);

	// Set the plot title and the axis labels
	plot2.setTitleText("A very simple example");
	plot2.getXAxis().setAxisLabelText("x axis");
	plot2.getYAxis().setAxisLabelText("y axis");

	// Draw it!
	plot2.defaultDraw();
}

function draw() {
	//  background(220);
}