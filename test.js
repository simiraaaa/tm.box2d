/// <reference path="Box2dWeb-2.1.a.3.min.js"/>
/// <reference path="tmlib.js"/>

(function (Box2D, tm, undefined) {
    var window = tm.global;
    var b2Color = Box2D.Common.b2Color,
       b2internal = Box2D.Common.b2internal,
       b2Settings = Box2D.Common.b2Settings,
       b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
       b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
       b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
       b2MassData = Box2D.Collision.Shapes.b2MassData,
       b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
       b2Shape = Box2D.Collision.Shapes.b2Shape,
       b2Mat22 = Box2D.Common.Math.b2Mat22,
       b2Mat33 = Box2D.Common.Math.b2Mat33,
       b2Math = Box2D.Common.Math.b2Math,
       b2Sweep = Box2D.Common.Math.b2Sweep,
       b2Transform = Box2D.Common.Math.b2Transform,
       b2Vec2 = Box2D.Common.Math.b2Vec2,
       b2Vec3 = Box2D.Common.Math.b2Vec3,
       b2Body = Box2D.Dynamics.b2Body,
       b2BodyDef = Box2D.Dynamics.b2BodyDef,
       b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
       b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
       b2ContactListener = Box2D.Dynamics.b2ContactListener,
       b2ContactManager = Box2D.Dynamics.b2ContactManager,
       b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
       b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
       b2FilterData = Box2D.Dynamics.b2FilterData,
       b2Fixture = Box2D.Dynamics.b2Fixture,
       b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
       b2Island = Box2D.Dynamics.b2Island,
       b2TimeStep = Box2D.Dynamics.b2TimeStep,
       b2World = Box2D.Dynamics.b2World,
       b2AABB = Box2D.Collision.b2AABB,
       b2Bound = Box2D.Collision.b2Bound,
       b2BoundValues = Box2D.Collision.b2BoundValues,
       b2Collision = Box2D.Collision.b2Collision,
       b2ContactID = Box2D.Collision.b2ContactID,
       b2ContactPoint = Box2D.Collision.b2ContactPoint,
       b2Distance = Box2D.Collision.b2Distance,
       b2DistanceInput = Box2D.Collision.b2DistanceInput,
       b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
       b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
       b2DynamicTree = Box2D.Collision.b2DynamicTree,
       b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
       b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
       b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
       b2Manifold = Box2D.Collision.b2Manifold,
       b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
       b2Point = Box2D.Collision.b2Point,
       b2RayCastInput = Box2D.Collision.b2RayCastInput,
       b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
       b2Segment = Box2D.Collision.b2Segment,
       b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
       b2Simplex = Box2D.Collision.b2Simplex,
       b2SimplexCache = Box2D.Collision.b2SimplexCache,
       b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
       b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
       b2TOIInput = Box2D.Collision.b2TOIInput,
       b2WorldManifold = Box2D.Collision.b2WorldManifold,
       ClipVertex = Box2D.Collision.ClipVertex,
       Features = Box2D.Collision.Features,
       IBroadPhase = Box2D.Collision.IBroadPhase,
       b2Controller = Box2D.Dynamics.Controllers.b2Controller;

    var display = tm.display,
        CanvasElement = display.CanvasElement,
        Sprite = display.Sprite,
        Shape = display.Shape,
        Label = display.Label;

    var asset = tm.asset,
        AssetManager = asset.AssetManager,
        assets = AssetManager.assets;

    var app;
    var SWIDTH = 640,
        SHEIGHT = 640,
        WSCALE = 32,
        WWIDTH = 10,
        WHEIGHT = 10;

    var worldGravity = new b2Vec2(0, 10);
    var world = new b2World(worldGravity, true);

    tm.main(function () {
        app = display.CanvasApp('#dummy');
        app.resize(640, 640).fitWindow().fps = 60;
        asset.Script.loadStats().onload = function () {
            app.enableStats();
        };

        app.run();

        app.replaceScene(GameScene());
        
    });

    var GameScene = tm.createClass({
        superClass: tm.app.Scene,

        init: function () {
            this.superInit();
            // 30行目から一番下のラインを引きます
            var bodyDef = new b2BodyDef();// 物体を宣言

            // これは一番下のラインなので動かない

            bodyDef.type = b2Body.b2_staticBody;
            // 動くやつはb2_dynamicBody
            var fixDef = createFixtureDefault();
            // 今回は四角形
            fixDef.shape = new b2PolygonShape();

            // 縦1pxのラインを引く
            // widthとheight(共通のスケールで割る)
            fixDef.shape.SetAsBox(320 / WSCALE, 10 / WSCALE);
            // xとy
            bodyDef.position.Set(320 / WSCALE, 640 / WSCALE);
            // 世界に突っ込む
            (rect = world.CreateBody(bodyDef)).CreateFixture(fixDef);
            tm.box2d.RectangleShape(rect).addChildTo(this);


            //---ue
            fixDef.shape.SetAsBox(320 / WSCALE, 10 / WSCALE);
            // xとy
            bodyDef.position.Set(320 / WSCALE, 0);
            (rect = world.CreateBody(bodyDef)).CreateFixture(fixDef);
            tm.box2d.RectangleShape(rect).addChildTo(this);
            //---left
            fixDef.shape = new b2PolygonShape();

            fixDef.shape.SetAsBox(10 / WSCALE, 320 / WSCALE);
            // xとy
            bodyDef.position.Set(0, 320 / WSCALE);
            (rect = world.CreateBody(bodyDef)).CreateFixture(fixDef);
            tm.box2d.RectangleShape(rect).addChildTo(this);


            //---right


            fixDef.shape = new b2PolygonShape();
            fixDef.shape.SetAsBox(10 / WSCALE, 640 / WSCALE);
            // xとy
            bodyDef.position.Set(640/WSCALE, 640 / WSCALE);
            (rect = world.CreateBody(bodyDef)).CreateFixture(fixDef);
            tm.box2d.RectangleShape(rect).addChildTo(this);

            var self = this;
            bodyDef.type = b2Body.b2_dynamicBody; // 今回は動く物体
            fixDef.shape = new b2CircleShape(15 / WSCALE); // 適当な半径をもつ丸にする
            (100).times(function () {
                // 42行目
                bodyDef.position.x = Math.rand(10,SWIDTH) / WSCALE; // 横300の位置に置く
                bodyDef.position.y = Math.rand(10, SHEIGHT / 2) / WSCALE; // 高さは0の場所から
                //fixDef.shape.SetAsBox(15 / WSCALE, 15 / WSCALE);
                (circ = world.CreateBody(bodyDef)).CreateFixture(fixDef); // 世界
                heart=tm.box2d.HeartShape(circ, { width: 30, height: 30 }).addChildTo(self);
            });
            //var debugDraw = new b2DebugDraw(); // debug用オブジェクト
            //debugDraw.SetSprite(document.getElementById("world").getContext("2d")); // 描画するcanvasを設定
            //debugDraw.SetDrawScale(WSCALE); // この世界のスケールを設定
            //debugDraw.SetFillAlpha(0.5); // 要素の透過度を設定
            //debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit); // 表示する内容を定数で指定
            //world.SetDebugDraw(debugDraw); // 世界にdebug要素を突っ込む


            function update() {
                // 世界を少しずつ進めていく
                world.Step(1 / 60, 1, 1);
                //// デバッグ描画の書き直し
                //world.DrawDebugData();
                //world.ClearForces();
            };
            this.onenterframe = update;

            fixDef.shape = new b2CircleShape(30 / WSCALE); // 適当な半径をもつ丸にする

            (circ = world.CreateBody(bodyDef)).CreateFixture(fixDef); // 世界
            this.circle = tm.box2d.CircleShape(circ).addChildTo(this);
        },

        update: function (app) {
            var p = app.pointing;
            this.circle.setPosition(p.x, p.y);
        }
    });

    var V2 = tm.define('tm.box2d.Vector2', {
        superClass: tm.geom.Vector2,
        position: null,

        init: function (b2vec2) {
            this.position = b2vec2;
            this.superInit(b2vec2.x, b2vec2.y);
        },
    });
    var SCALE = 32;
    V2.accessor('SCALE', {
        get: function () { return SCALE; },
        set: function (v) { SCALE = v; },
    });


    V2.prototype.accessor('x', {
        get: function () { return SCALE * this.position.x; },
        set: function (v) { this.position.x = v / SCALE; },
    });
    V2.prototype.accessor('y', {
        get: function () { return SCALE * this.position.y; },
        set: function (v) { this.position.y = v / SCALE; },
    });

    var DEG_TO_RAD = Math.DEG_TO_RAD;
    var RAD_TO_DEG = Math.RAD_TO_DEG;

    var Shape = tm.box2d.Shape = function (name, body, args) {
        
        args = args || {};
        var fixture = body.GetFixtureList();
        var b2shape = fixture.GetShape();
        var sweep = body.m_sweep;
        if (!args.width || !args.height) {
            var width, height;
            if (b2shape.m_vertices) {
                // Polygon
                var v = b2shape.m_vertices;

            } else {
                // Circle
                width = height = SCALE * b2shape.m_radius * 2;
            }
            if (!args.width) args.width = width;
            if (!args.height) args.height = height;
        }

        var shape = tm.display[(name || '') + 'Shape'](args);
        shape.position = V2(body.GetPosition());
        
        // set は重いかもしれない
        shape.accessor('rotation', {
            get: function () { return sweep.a * RAD_TO_DEG; },
            set: function (v) { return body.SetAngle(v) * DEG_TO_RAD; },
        });
        shape.accessor('x', {
            get: function () { return this.position.x; },
            set: function (v) { return body.SetPosition({ x: v / SCALE, y: this.position.position.y }); },
        });

        shape.accessor('y', {
            get: function () { return this.position.y; },
            set: function (v) { return body.SetPosition({ x: this.position.position.x, y: v / SCALE }); },
        });

        shape.setPosition = function (x, y) {
            body.SetPosition({ x: x / SCALE, y: y / SCALE });
            return this;
        };

        return shape;
    };

    ['Circle','Rectangle','RoundRectangle','Star','Heart','Polygon'].forEach(function(e){
        tm.box2d[e+'Shape']=function(body, args){
            return Shape(e,body,args);
        };
    });

    //密度,摩擦係数,反発係数
    function createFixture(density, friction, restitution) {
        var fixDef = new b2FixtureDef(); // 入れ物生成
        fixDef.density = density; // 密度
        fixDef.friction = friction // 摩擦係数
        fixDef.restitution = restitution; // 反発係数
        return fixDef;
    }

    function createFixtureDefault() {
        return createFixture(1.0, 0.5, 0.5);
    }



})(Box2D, tm);