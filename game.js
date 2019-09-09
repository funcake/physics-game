    // module aliases
    const { Engine,    Render,    World,  Body,  Common, Bodies, Mouse ,MouseConstraint, Constraint,Composites,Composite, Events, Vector,Bounds} = Matter;

    // create an engine
    var engine = Engine.create(),
     world = engine.world;
     bounds = world.bounds;
    // create a renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
               hasBounds: true,
               enabled: true,
               wireframes: true, // 线框模式
               showSleeping: true, // 刚体睡眠状态
               showDebug: true, // Debug 信息
               showBroadphase: false, // 粗测阶段
               showBounds: false, // 刚体的界限
               showVelocity: true, // 移动刚体时速度
               showCollisions: true, // 刚体碰撞点
               showSeparations: false, // 刚体分离
               showAxes: true, // 刚体轴线
               showPositions: false, // 刚体位置
               showAngleIndicator: true, // 刚体转角指示
               showIds: true, // 显示每个刚体的 ID
               showVertexNumbers: false, // 刚体顶点数
               showConvexHulls: false, // 刚体凸包点
               showInternalEdges: false, // 刚体内部边界
               showMousePosition: false // 鼠标约束线
        }
    });



    function addBody(body) {
        World.add(engine.world,body);
    }

    function rmBody(body) {
            World.remove(engine.world,body);
        }

    function vectorAngle(v) {
        return Math.atan2(v.y, v.x);
    }



    var keyboard = new window.keypress.Listener();

    var mouse = Mouse.create(render.canvas);
    var mConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });


    var 
        boxA,
        boxB,
        car,
        ground,
        sprite,

        mouse,
        mConstraint;


    var
        categoryArrow = 0x0001;
    // create two sprite 
    class Hero {
        constructor(body) {

            this.body = body ? body:Bodies.circle(400,100,50);
            this.compound = Body.create({parts:[this.body]});
            this.create();
            this.control();
        }

        control() {
            keyboard.register_many([
                {
                    keys : 'left',
                    'on_keydown' : () => {
                        this.body.parent.angle-=.01;
                    },
                    is_exclusive:false,
                },
                {
                    keys : 'right',
                    'on_keydown' : () => {
                        this.body.parent.angle+=0.01;
                    },
                    is_exclusive:false,
                },
                {
                    keys : 'space',
                    'on_keydown' : () => {
                        Body.applyForce(this.body,this.body.parent.position,{x:0,y:-.2});
                    },
                    is_exclusive:false,
                },
                ]
            )
        }

        create() {addBody(this.compound)};

    }
    sprite = new Hero;

    class Arrow {
        constructor(x,y) {
            this.body = Bodies.rectangle(sprite.body.position.x,sprite.body.position.y-100,50,1,{group:-1});
            Body.setVelocity(this.body,{x:x,y:y});
            this.body.isC = true;
            this.create();
            this.rotate();
        }
    
        rotate() {
                Events.on(engine,'beforeTick',()=> {
                    if (!this.body.isC) {

                        Body.setAngle(this.body,vectorAngle(this.body.velocity));
                    }
                    // Bounds.shift(render.bounds,Vector.sub(sprite.body.position,{x:window.innerWidth/3.5 ,y:window.innerHeight/1.5}));
                        // Vector.add(sprite.body.position,{x:100,y:500}));
                });

        }

        static drag() { 
            let x,y = 0;
            document.onmousedown = function (e) {
                x = e.clientX;
                y = e.clientY;
            }
            document.onmouseup = function (e) {
                x = e.clientX - x;
                y = e.clientY - y;
                // let vector = Vector.create(-x/5,-y/5);
                var dot = new Arrow(x,y)
                World.add(engine.world,[dot]);
            }
        }
        

        create() {
            addBody(this.body);
        }
    }

    Arrow.drag();



     boxA = Bodies.rectangle(100, 100, 80, 80,{category : categoryArrow});
     boxB = Bodies.rectangle(200, 100, 80, 80,{category : -1,});
     car = Composites.car(300,100,100,50,50);
     ground = Bodies.rectangle(400, 610, 20000, 60, { isStatic: true });




    addBody([
        boxA,
        boxB,
        // car,
        ground,

        mConstraint,]);

    render.mouse = mouse;




    Events.on(engine,'beforeTick',function() {
        Bounds.shift(render.bounds,Vector.sub(sprite.body.position,{x:window.innerWidth/3.5 ,y:window.innerHeight/1.5}));
    });


    // Events.on(engine,'collisionStart',(e) => {
    //  var pairs = e.pairs;
    //  for (var i = 0; i < pairs.length; i++) {
    //      var pair = pairs[i];
    //      var AandB = pair.bodyA.isC === false ? [pair.bodyA,pair.bodyB]:
    //      pair.bodyB.isC === false?[pair.bodyB,pair.bodyA]:false;
    //      if(AandB) {
    //          console.log(AandB);
    //              AandB[0].isC= true;
    //          if ( AandB[1] === sprite.body) {
    //              parts = AandB[1].parent.parts.concat(AandB[0]);
    //              rmBody([AandB[0],AandB[1].parent]);
    //              parts.shift();
    //              addBody(Body.create( {parts} ) );
    //              console.log(AandB);
    //  /*      } else if(AandB[1] !== ground) {
    //              console.log(AandB);
    //              rmBody(AandB);
    //              addBody(  Body.create( {parts:AandB} )  );*/
    //          }
    //      }
    //  }
    // });

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);