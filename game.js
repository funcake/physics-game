// module aliases
const { Engine,    Render,    World,  Body,  Bodies, Mouse ,MouseConstraint, Constraint,Composites,Composite, Events, Vector} = Matter;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
    	   hasBounds: false,
    	   enabled: true,
    	   wireframes: true, // 线框模式
    	   showSleeping: true, // 刚体睡眠状态
    	   showDebug: false, // Debug 信息
    	   showBroadphase: false, // 粗测阶段
    	   showBounds: false, // 刚体的界限
    	   showVelocity: true, // 移动刚体时速度
    	   showCollisions: true, // 刚体碰撞点
    	   showSeparations: false, // 刚体分离
    	   showAxes: true, // 刚体轴线
    	   showPositions: false, // 刚体位置
    	   showAngleIndicator: true, // 刚体转角指示
    	   showIds: false, // 显示每个刚体的 ID
    	   showVertexNumbers: false, // 刚体顶点数
    	   showConvexHulls: false, // 刚体凸包点
    	   showInternalEdges: false, // 刚体内部边界
    	   showMousePosition: false // 鼠标约束线
    }
});

let objects = [];

let mContraint = MouseConstraint.create(engine,{});

// create two boxes and a ground
var boxA = Bodies.rectangle(100, 100, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var boxC = Bodies.rectangle(350, 50, 80, 80);
var boxD = Bodies.rectangle(200, 50, 80, 80);
let net = Composites.car(300,100,100,50,50);
let r = Bodies.circle(400,50,30);
let r1 = Bodies.circle(300,50,30);

let compound = Body.create({ parts: [boxB,boxC]});

let comp = Constraint.create({bodyA: r1,bodyB:r})

var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

let sling = Constraint.create({pointA:{x:100,y:100},bodyB:boxA});

let keyboard = new window.keypress.Listener();

keyboard.simple_combo('right',function() {
	Body.setAngularVelocity(r,r.angularVelocity+0.01);
});
keyboard.simple_combo('space',function() {
    Body.setAngularVelocity(r,r.angularVelocity+0.01);
});

 keyboard.simple_combo('left',function() {
	Body.setAngularVelocity(r,r.angularVelocity-0.01);
}); 

 document.onclick =  function (e) {
	var dot = Bodies.circle(e.pageX,e.pageY,5);
	let vector = Vector.create(20,0);
	Body.setVelocity(dot,vector);
	World.add(engine.world,[dot]);
}

// add all of the bodies to the world
World.add(engine.world, [boxA,  ground , mContraint, sling, r,r1,comp]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);