console.log('Start');

//Model classes
function Ubigeo(cod, name, parent) {
  this.cod = cod;
  this.name = name;
  
  if(parent){
    this.setParent(parent);
  }
}
Ubigeo.prototype = {
  print: function() {
    console.log('Código: ' + this.cod + ', name: ' + this.name);
    
    var p = this.parent;
    if(p !== null && p !== undefined) {
      console.log('Y mi padre es: ' + p.cod + ', ' + p.name);
    }
  },
  setParent: function(ubigeo) {
    this.parent = ubigeo;
  }
};


function Department(id, name, parent) {
  Ubigeo.call(this, id, name, parent);
};
Department.prototype = Object.create(Ubigeo.prototype);
Department.prototype.setParent = function(ubigeo) {
  this.parent = null;
  
  console.error('This method is not available for departments');
};


function Province(id, name, parent) {
  Ubigeo.call(this, id, name, parent);
};
Province.prototype = Object.create(Ubigeo.prototype);


function District(id, name, parent) {
  Ubigeo.call(this, id, name, parent);
};
District.prototype = Object.create(Ubigeo.prototype);


//Represents an element of the tree, for this problem, an Ubigeo object.
function Node(data) {
  this.data = data;
  this.parent = null;
  this.children = [];
}
Node.prototype = {
  addChildren: function(node) {
    node.parent = this;
    this.children.push(node);
  }
};

//Represents the tree, container of Ubigeos
function Tree() {
  this.root = null;
}
Tree.prototype = {
  add: function(node, targetCriteria){
    var targetNode = this.search(targetCriteria);

    if(!Node.prototype.isPrototypeOf(node)) {
      return;
    }
    
    if(!this.root) {
      this.root = node; //Adds it as root element
      return;
    } 
    
    if(targetNode) {
      targetNode.addChildren(node);
    } else {
      //Add as child root
      this.root.addChildren(node);
    }
  },
  search: function(criteria) {
    if(!this.root)
      return null;
    
    if(!criteria)
      return null;
    
    var nodesToVisit = [];
    var curr = this.root;
    
    while(curr) {
      nodesToVisit = nodesToVisit.concat(curr.children);
      
      if (criteria.call(this, curr)){
        return curr;
      }
      
      curr = nodesToVisit.shift();
    }
  }
};


function CountryModule(){
  this.rawData = null;
  this.tree = new Tree();
  this.tree.add(new Node(new Ubigeo('0', 'Peru')));
};
CountryModule.prototype = {
  readData: function() {
    var xhr = new XMLHttpRequest();
    var cm = this;
    
    xhr.onreadystatechange = function (){
      if(xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          cm.rawData = xhr.responseText;
          cm.processData();
        } else {
          alert('Data not available');
        }
      }
    };
    
    xhr.open('get', '../data/data.txt');
    xhr.send();
  },
  processData: function() {
    var lines = this.rawData.split("\n");
    var tree = this.tree;
    
    lines.forEach(function(l){
      l = l.replace(/[”“]+/g, '');
      
      var u = l.split(' / ');
      u = u.map(function(el) {
        if(el.length < 1)
          return [''];
        
        var idx = el.indexOf(' ');
        
        return [el.substring(0, idx), el.substring(idx + 1)];
      });
      
      if(u[2].length === 2) {
        //It is a District
        var di = new District(u[2][0], u[2][1]);
        
        tree.add(new Node(di), function (node) {
          return node.data.cod === u[1][0]; //Searches for a Province
        });
      } else if(u[1].length === 2) {
        //Province defined
        var p = new Province(u[1][0], u[1][1]);
        
        tree.add(new Node(p), function (node) {
          return node.data.cod === u[0][0]; //Searches for a Department
        });
      } else if(u[0].length === 2) {
        //Department defined
        var p = new Department(u[0][0], u[0][1]);
        
        tree.add(new Node(p));
      } else {
        console.error('No proper ubigeo defined in data');
      }
      
    });
  }
};


var cm = new CountryModule();
cm.readData();

console.log(cm.tree);

/*
var u = new Ubigeo('0', 'Peru');
var d = new Department('01', 'Lima');
var p = new Province('52', 'Barranca', d);
var di = new District('253', 'La Molina', p);
var di2 = new District('253', 'El Palmar', p);


//Structure to keep data
var peru = new Tree();
peru.add(new Node(u));

peru.add(new Node(d), function(node){
  return node.data.cod === u.cod;
});

peru.add(new Node(p), function(node){
  return node.data.cod === d.cod;
});

peru.add(new Node(di), function(node){
  return node.data.cod === p.cod;
});

peru.add(new Node(di2), function(node){
  return node.data.cod === p.cod;
});


console.log(peru);
*/




//Search sample
/*
var r = peru.search(function(node){
  return node.data.cod === '0';
});
console.log(r);
*/



/*

//Stage contiene los atributos de las etapas, en el prototype define los métodos disponibles
function Stage(id){
  this.id = id;
}
Stage.prototype = {
  setDate: function(dateString) {
    this.date = dateString;
  }
};

function LiveStage(id){
  Stage.call(this, id);
  this.remainingKm = 0;
  this.liveComments = [];
}
LiveStage.prototype = Object.create(Stage.prototype);
LiveStage.prototype.setRemainingKms = function (kms){
  this.remainingKm = kms;
};
LiveStage.prototype.setLiveComments = function (commentsArray){
  this.liveComments = commentsArray;
};

//Generalización de los módulos a desarrollar para el especial
function Module(configFile){
  this.configFile = configFile;
  this.sponsorActive = false;
  this.logoPath = '';
  this.stagesPath = '';
  this.stages = [];
}
Module.prototype = {
  readData: function() {
    console.log('Este método debería ser sobre-escrito por una de sus clases hijas para leer la información que necesita');
  },
  render: function() {
    console.log('Este método debería ser sobre-escrito por una de sus clases hijas para mostrar contenido');
  },
  update: function() {
    this.readData();
  },
  config: function() {
    console.log('Este método debería ser sobre-escrito por una de sus clases hijas para inicializar el módulo');
  }
};


function ModuleHome(configFile) {
  Module.call(this, configFile);

  this.stage = null;
  this.linkToResults = '#';
  this.linkToSpecial = '#';
  this.commentPath = '';
  
  this.config();
}
ModuleHome.prototype = Object.create(Module.prototype);
ModuleHome.prototype.config = function () {
  var thisModule = this;
  
  jsonReader.readJSON(this.configFile, function(data){
    thisModule.linkToResults = data['link-to-results'];
    thisModule.linkToSpecial = data['link-to-special'];
    thisModule.stagesPath = data['stages-path'];
    thisModule.commentPath = data['live-comments-path'];
    thisModule.sponsorActive = data['sponsor-active'];
    thisModule.logoPath = data['logo-path'];
  });
};

function Hash(){
  this.length = 0;
  this.data = {};
}
Hash.prototype = {
  getLength: function(){
    return this.length;
  },
  addElement: function(key, value) {
    if(this.data.hasOwnProperty(key)) {
      this.length++;
    }
    
    this.data[key] = value;
  },
  print: function() {
    console.log('Este hash tiene ' + this.length);
    
    for(var key in this.data) {
      console.log(this.data[key]);
    }
  }
};

*/