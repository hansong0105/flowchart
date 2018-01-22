var input = {"audit":{"name":"AUDIT","description":"DESCRIPTION","is_live":"true","steps":[{"name":"STEP1","exit_conditions":[{"min_risk":0,"max_risk":1,"exit_step":1}],"step_actions":[{"type":"instruction","content":"DOTHIS"},{"type":"question","content":"why?","answers":[{"content":"yes","score":"1"},{"content":"no","score":"0"}]}]},{"name":"STEP2"}],"exit_conditions":[{"step":"0","exit_step":"1","min_risk":"0","max_risk":"1"}], "tags":[{"name":"general"},{"name":"housekeeping"}]}};
var key = -1;
var nodearray = new Array();
var linkarray = new Array();
var inputjson;
var outputjson = {
	"class": "go.GraphLinksModel",
	"nodeDataArray": [],
	"linkDataArray": [],

};

function noreson(){
	this.category = "Steps";
	this.reasonsList = [
	  {
		"text": "STEP1"
	  }
  ];
	this.key = 0;


}

function Steps(name){
	this.category = "Steps";
	this.key = key;
	this.reasonsList = [
	  {
		"text": name
	  }
  ];
	key--;

}

function exit_conditions(cons){
	this.category = "Steps";
	this.key = key;
	if(cons!==null){
		var temp = new Array();
		for(var att in cons){
			var obj = {
				"text": att+":"+cons[att]
			};
			temp.push(obj);
		}
		this.reasonsList = temp;
	}
	key--;
}

// function introduction(content){
// 	this.category = "instruction";
// 	this.key = key;
// 	this.content = content;
// 	key--;
// }

function question(content){
	this.category = "Judgment";
	this.key = key;
	this.text = content;
	key--;
}

function Answer(content, score){
	this.category = "Answer";
	this.key = key;
	this.text = content;
	this.score = score;
	key--;
}

function noreson(){
	this.category = "";
	this.key = 0;
}

function person(firstname,lastname,age,eyecolor)
{
this.firstname=firstname;
this.lastname=lastname;
this.age=age;
this.eyecolor=eyecolor;
}

function init(str){
	if (str!==undefined){
		inputjson = {
			name : str.audit.name,
			description : str.audit.description,
			is_live : str.audit.is_live,
			steps : str.audit.steps,
			exit_conditions : str.audit.exit_conditions,
			tags : str.audit.tags,
		};
	}
	else{
		inputjson = {
			name : input.audit.name,
			description : input.audit.description,
			is_live : input.audit.is_live,
			steps : input.audit.steps,
			exit_conditions : input.audit.exit_conditions,
			tags : input.audit.tags,
		};
	}

	Audit();
	outputjson.nodeDataArray = nodearray;
	outputjson.linkDataArray = linkarray;
	var str = JSON.stringify(outputjson);
	var obj = JSON.parse(str);
	return obj;
}

function Audit(){
	audit(inputjson.name);
	var father = key+1;
	var child;
	if(inputjson.is_live!==undefined){
		var temp = new Description("is_live: "+inputjson.is_live);
		nodearray.push(temp);
		child = key+1;
		var link = new influence(father, child);
		linkarray.push(link);
	}
	if(inputjson.tags!==undefined){
		var temp1 = new Description("tags");
		nodearray.push(temp1);
		child = key+1;
		var link1 = new influence(father, child);
		linkarray.push(link1);
		tag(inputjson.tags, child);
	}
	if(inputjson.description!==undefined){
		var temp2 = new Description("description: "+inputjson.description);
		nodearray.push(temp2);
		child = key+1;
		var link2 = new influence(father, child);
		linkarray.push(link2);
	}
	if(inputjson.steps!==undefined){
		var temp3 = new Description("steps");
		nodearray.push(temp3);
		child = key+1;
		var link3 = new influence(father, child);
		linkarray.push(link3);
		Step(inputjson.steps, child);

	}
	if(inputjson.exit_conditions!==undefined){
		var temp4 = new Description("exit_condition");
		nodearray.push(temp4);
		child = key+1;
		var link4 = new influence(father, child);
		linkarray.push(link4);
		Exit(inputjson.exit_conditions, child);
	}
}

function audit(str){
	var temp = new noreson();
	temp.category = "Name";
	temp.key = key;
	temp.text = "Name:"+str;
	nodearray.push(temp);
	// outputjson.nodeDataArray=nodearray;
	key--;

}

function Description(str){
	this.category = "Description";
	this.text=str;
	this.key = key;
	key--;

}

function Step(steps, father){
	for (var i in steps){
		if(steps[i].name!==null){
			var temp = new Steps(steps[i].name,null);
			nodearray.push(temp);
			child = key+1;
			var link = new flow(father, child);
			linkarray.push(link);
			var subfather = child;
			if(steps[i].exit_conditions!==undefined){
				var temp1 = new Description("exit_conditions");
				nodearray.push(temp1);
				child = key+1;
				var link1 = new influence(subfather, child);
				linkarray.push(link1);
				Exit(steps[i].exit_conditions, child);

			}
			if(steps[i].step_actions!==undefined){
					var temp2 = new Description("step_actions");
					nodearray.push(temp2);
					child = key+1;
					var link2 = new influence(subfather, child);
					linkarray.push(link2);
				step_actions(steps[i].step_actions, child);
			}
		}
		// if(steps[i].exit_conditions!==null){
			// var temp1 = new Description("exit_conditions");
			// nodearray.push(temp1);
			// child = key+1;
			// var link1 = new influence(father, child);
			// linkarray.push(link1);
		// 	Exit(steps[i].exit_conditions, child);
		//
		// }
		// if(steps[i].step_actions!==null){
		// 	var temp2 = new Description("step_actions");
		// 	nodearray.push(temp2);
		// 	child = key+1;
		// 	var link2 = new influence(father, child);
		// 	linkarray.push(link2);
		// 	step_actions(steps[i].step_actions, child);
		// }
	}

}

function step_actions(actions, father){
	var newfather =father;
	for(var i in actions){
		if(actions[i].type==="instruction"){
			var temp = new Steps(actions[i].content);
			nodearray.push(temp);
			child = key+1;
			var link = new flow(newfather, child);
			linkarray.push(link);
			newfather = child;
		}
		if(actions[i].type==="question"){
			var temp1 = new question(actions[i].content);
			nodearray.push(temp1);
			child = key+1;
			var link4 = new flow(newfather, child);
			linkarray.push(link4);
			answers(actions[i].answers, child);
		}
	}

}

function tag(tags, father){
	console.log(111);
	for(var i in tags){
		var temp1 = new Description(tags[i].name);
		nodearray.push(temp1);
		child = key+1;
		var link1 = new influence(father, child);
		linkarray.push(link1);
	}
}

function answers(answer, father){
	for(var i in answer){
		var temp = new Answer(answer[i].content, answer[i].score);
		nodearray.push(temp);
		child = key+1;
		var link = new flow(father, child);
		linkarray.push(link);
	}
}

function Exit(exits, father){
	for(var i in exits){
		var temp = new exit_conditions(exits[i]);
		nodearray.push(temp);
		child = key+1;
		var link4 = new flow(father, child);
		linkarray.push(link4);
	}
}

function influence(from,to){
	this.category = "influence";
	this.from = from;
	this.to = to;
}

function flow(from,to){
	this.category = "flow";
	this.from = from;
	this.to = to;
}
