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
  },
  printUbigeosTable: function(ubigeosArray, tablename) {
    var container = document.getElementById('main-container');

    var table = document.createElement('table');
    table.setAttribute('class', 'ubigeo-table ' + tablename);

    table.appendChild(htmlToElement('<caption>' + tablename + '</caption>'));
    table.appendChild(htmlToElement('<tr><th>Code</th><th>Name</th><th>Code</th><th>Name</th></tr>'));

    ubigeosArray.forEach( function(u) {
      row = htmlToElement('<tr>' 
              + '<td>' + u.cod + '</td>'
              + '<td>' + u.name + '</td>'
              + '<td>' + (u.parent ? u.parent.cod : '-') + '</td>'
              + '<td>' + (u.parent ? u.parent.name : '-') + '</td>'
              + '</tr>');

      table.appendChild(row);
    });

    container.appendChild(table);
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
    console.log(targetNode);

    if(!Node.prototype.isPrototypeOf(node)) {
      return;
    }
    
    if(!this.root) {
      this.root = node; //Adds it as root element
      return;
    } 
    
    if(targetNode) {
      targetNode.addChildren(node);
      node.data.setParent(targetNode.data);
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
    
    this.showData();
  },
  showData: function() {
    var departments = [];
    var provinces = [];
    var districts = [];
    
    var nodesToVisit = [];
    var curr = this.tree.root;
    
    while(curr) {
      nodesToVisit = nodesToVisit.concat(curr.children);
      
      var targetArray = null;
      
      if (Department.prototype.isPrototypeOf(curr.data)){
        targetArray = departments;
      }
      if (Province.prototype.isPrototypeOf(curr.data)){
        targetArray = provinces;
      }
      if (District.prototype.isPrototypeOf(curr.data)){
        targetArray = districts;
      }
      
      if(targetArray) {
        targetArray.push(curr.data);
      }
      
      curr = nodesToVisit.shift();
    }
    
    Ubigeo.prototype.printUbigeosTable(departments, 'departments');
    Ubigeo.prototype.printUbigeosTable(provinces, 'provinces');
    Ubigeo.prototype.printUbigeosTable(districts, 'districts');
  }
};

function htmlToElement(html) {
  var dummy = document.createElement('template');
  dummy.innerHTML = html;
  return dummy.content.firstChild;
}

var cm = new CountryModule();
cm.readData();
