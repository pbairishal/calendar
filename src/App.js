import React, { Component } from 'react';
import moment from 'moment';
import './App.scss';
import data from './data.json';
import Modal from 'react-modal';
 
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
      data: data,
		  namesInitial: data,
      setData:Object.create(data),
      month: moment(),
      selected: moment().startOf('day'),
      modalIsOpen: false,
		};
    
    this.nextId = this.nextId.bind(this);
    this.previousDay = this.previousDay.bind(this);
    this.nextDay = this.nextDay.bind(this); 
    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.onAddANewTaskToArray = this.onAddANewTaskToArray.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
	}


  // ----- Functions Starts
  componentDidMount(){
    //this.loadData();
   localStorage.clear();
    
     const cachedHits = localStorage.getItem('myData');
      if (cachedHits) {
        console.log(JSON.parse(cachedHits),"local-storage");
        let localStorageData = JSON.parse(cachedHits);
        this.setState({ 
          data: localStorageData,
          namesInitial: localStorageData,
          setData : localStorageData
        },function(){
          this.handleChange();
          console.log(this.state.data,"data")
          console.log(this.state.setData,"setData")
        });
        return;
      }
    else{
      this.handleChange();
      return;
    }
    
  } 
 
  //------  API Call
  loadData() {
		fetch('./data/data.json')
			.then(response => response.json())
			.then(data => {
				this.setState({data: data })
		})
			.catch(err => console.error(this.props.url, err.toString()))
  }
  
  //------ Modal Functions
  openModal() {
    this.setState({modalIsOpen: true});
  }
 
  closeModal() {
    this.setState({modalIsOpen: false});
  }

	//------ Calendar Functions
 
  previousDay() {
    const {
      month,
    } = this.state;

    this.setState({
      month: month.subtract(1, 'days'),
    });
    this.handleChange();
  }

  nextDay() {
    const {
      month,
    } = this.state;

    this.setState({
      month: month.add(1,'days'),
    });
      this.handleChange();
  }
    
  previousMonth() {
    const {
      month,
    } = this.state;

    this.setState({
      month: month.subtract(1, 'month'),
    });
      this.handleChange();
  }

  nextMonth() {
    const {
      month,
    } = this.state;

    this.setState({
      month: month.add(1,'month'),
    });
      this.handleChange();
  }

  renderMonthLabel() {
    const {
      month,
    } = this.state;

    return <span className="date-label">{month.format("DD MMMM,  YYYY")}</span>;
  }
     
  //--------- Lists Functions

  handleChange () {
    const data = this.state.namesInitial.filter(item => {             
    let date = new Date(item.startTime);    
     return date.toDateString().includes(this.state.month.format("ddd MMM DD YYYY"));
   });
   this.setState({ data });
 } 

	nextId(){
    console.log(this.state.setData,"count");
		this._newId = this.state.setData.length + 1;
		return this._newId++
	}

	onAddANewTaskToArray(title,startDate,endDate){
		let newData = {
      startTime:new Date(startDate),
      endTime:new Date(endDate),
      title: title,
		  id: this.nextId(),
		};
		let datas = [...this.state.data, newData];
    let datas1 = [...this.state.namesInitial, newData];
    let setdata = [...this.state.setData, newData];

    localStorage.setItem('myData', JSON.stringify(setdata));
    
		this.setState({
			data: datas,
      namesInitial: datas1,
      setData: setdata
		},function(){
      this.handleChange();
    })
    
	}

	onDeleteATaskInApp(id){
    let newId,newId1,newId2 = 1;
    let data = this.state.data.filter(data => data.id !== id)
    let data1 = this.state.namesInitial.filter(data => data.id !== id)
    let setdata = this.state.setData.filter(data => data.id !== id)
  
    data.forEach(obj => obj.id = newId++)
    data1.forEach(obj => obj.id = newId1++)
    setdata.forEach(obj => obj.id = newId2++)
    
    localStorage.setItem('myData', JSON.stringify(setdata));
   
		this.setState({ 
      data:data,
      namesInitial:data1,
      setData:setdata
    })
	}

	onEdit(id, title ,startTime, endTime){
		let datas = this.state.data.map(data => {
			if (data.id === id) {
        data.title = title
        data.startTime = startTime
        data.endTime = endTime
			}
			return data
    })
    let datas1 = this.state.namesInitial.map(data => {
			if (data.id === id) {
        data.title = title
        data.startTime = startTime
        data.endTime = endTime
			}
			return data
		})
    let setdata = this.state.setData.map(data => {
			if (data.id === id) {
        data.title = title
        data.startTime = startTime
        data.endTime = endTime
			}
			return data
    })
    
    localStorage.setItem('myData', JSON.stringify(setdata));
		this.setState({data: datas, setData: setdata, namesInitial: datas1},function(){
      this.handleChange();
    })
  }

  createElements(){
    let elements = [];
    for(let i =0; i < 24; i++){
        elements.push(<li><span>{`${i}`.padStart(2, 0)}:00</span></li>);
    }
    return elements;
  }
  
	// ----- Functions Ends

	render(){
		return(
			<div>

        <section className="calendar"> 
            <header className="header">
              <div className="month-display row">
                <i className="arrow fa fa-angle-double-left" onClick={this.previousMonth}/>
                <i className="arrow fa fa-angle-left" onClick={this.previousDay}/>
                {this.renderMonthLabel()}
                <i className="arrow fa fa-angle-right" onClick={this.nextDay}/>
                <i className="arrow fa fa-angle-double-right" onClick={this.nextMonth}/>
                <a className="add-list" onClick={this.openModal}>ADD</a>
              </div>
            </header>
        </section>   

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          >
            <div className="modal-header">
              <span>Create New Events</span>
              <i className="fa fa-times fa-2x" onClick={this.closeModal}></i>
            </div>
              
            <Form onAddANewTask={this.onAddANewTaskToArray.bind(this)}/>
            
        </Modal>
              
          <div className="cd-schedule loading">
              <div className="timeline">
                <ul>
                    {this.createElements()}
                </ul>
              </div> 

              <div className="events">
                <ul>
                  <li className="events-group">
                    <div className="top-info"><span>Events</span></div>
                    <ul>       
                      {this.state.data.map( (list) =>
                            <List
                            title={list.title}
                            startTime={list.startTime}
                            endTime={list.endTime}  
                            id={list.id}
                            key={list.id}
                            onDeleteATaskFromTodo={this.onDeleteATaskInApp.bind(this)}
                            onEdit = {this.onEdit.bind(this)}
                            />
                        )}
                    </ul>
                  </li>      
                </ul>
              </div>

            </div> 
			</div>
		)
	}
}

// end of App class

// ---Components Starts

// List Component

class List extends Component {
	constructor(props) {
		super(props)

		this.state = {
      editing: false,
      editModal:false
    }
    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
  }

  //------ Modal functions
  openEditModal() {
    this.setState({editModal: true});
  }
 
  closeEditModal() {
    this.setState({editModal: false});
  }

	onDeleteATask() {
		this.props.onDeleteATaskFromTodo(this.props.id)

	}

	onEditTask() {
    console.log(this.state.editing);
    this.openEditModal();
		this.setState({editing: true})

	}

	formSubmit(event){
		event.preventDefault();
    let title = this.refs.title.value;
    let startTime = this.refs.startTime.value;
    let endTime = this.refs.endTime.value;
		
		this.props.onEdit(this.props.id, title ,startTime, endTime);

		this.setState({editing: false})

  }
  
  setOnTimeline(startTime,endTime){
    let start = this.getScheduleTimestamp((new Date(startTime)).getHours() + ":" + (new Date(startTime)).getMinutes());
    let duration = this.getScheduleTimestamp((new Date(endTime)).getHours() + ":" + (new Date(endTime)).getMinutes()) - start;
    
    let eventTop = 50*(start - 0)/60;
    let eventHeight = 50*duration/60;
	  let Style = {
      top: (eventTop -1) +'px',
      height: (eventHeight+1)+'px',
      width: (Math.random() * (100 - 50) + 50) + '%'
    };
    return Style;
  }
  
  getScheduleTimestamp(time) {
		time = time.replace(/ /g,'');
		let timeArray = time.split(':');
		let timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
		return timeStamp;
  }
  
  getShortName(e){
    if(e.length<30){
      return e;
    }
      return e.substr(0, 30) + `...`;
  }

  getIsoTime(s){
    let date = new Date(s);
    return `${date.getFullYear()}-${`${date.getMonth() +
      1}`.padStart(2, 0)}-${`${date.getDate()}`.padStart(
      2,
      0
    )}T${`${date.getHours()}`.padStart(
      2,
      0
    )}:${`${date.getMinutes()}`.padStart(2, 0)}`;
  }

	render(){
		return(
      this.state.editing ? 
      
      <Modal
          isOpen={this.state.editModal}
          onRequestClose={this.closeEditModal}
          style={customStyles}
          >
          <div className="modal-header">
          <span>Edit Events</span>
          <i className="fa fa-times fa-2x" onClick={this.closeEditModal}></i>
          </div>
          <form onSubmit={this.formSubmit} className="form">
              <label>Title:</label>
              <input type="text" ref='title' defaultValue={this.props.title}/>
              <label>Start Time:</label>
              <input type="datetime-local" ref='startTime' defaultValue={this.getIsoTime(this.props.startTime)}/> 
              <label>End Time:</label>
              <input type="datetime-local" ref='endTime' defaultValue={this.getIsoTime(this.props.endTime)}/>           
              <Button icon={'save'} type='submit' className="submit-form" onClick={this.formSubmit.bind(this)}/>
          </form>
      </Modal>

  :
      
      <li className="single-event" style={this.setOnTimeline(this.props.startTime,this.props.endTime)}>
						<span>
							<em className="event-name">{this.getShortName(this.props.title)}</em>
						</span>
            <div className="button-section">
                <Button icon={'edit'}
                  onClick={this.onEditTask.bind(this)}
                  className="edit-button"
                />
                <Button icon={'delete'}
                    onClick={this.onDeleteATask.bind(this)}
                    className="delete-button"
                />
            </div> 
			</li>

		)
	}
}

// Button Component

function Button(props){
	return(
		<button className={props.className}
				onClick={props.onClick}
					{...props}>
					{ props.icon ?
						props.icon
					:props.children}
		</button>
	)
}

// Form Component

class Form extends Component {
	constructor(props){
		super(props);
		this.state = {
			title: '',
      startDate: `${new Date().getFullYear()}-${`${new Date().getMonth() +
        1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(
        2,
        0
      )}T${`${new Date().getHours()}`.padStart(
        2,
        0
      )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
      endDate: `${new Date().getFullYear()}-${`${new Date().getMonth() +
        1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(
        2,
        0
      )}T${`${new Date().getHours()}`.padStart(
        2,
        0
      )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
      
		}
	}


	// ----- functions starts
  handleChange1(field, e){
    this.setState({ [field]: e.target.value });
  };
	ChangeANewTask(event){
		this.setState({title: event.target.value});
	};

	NewTaskSubmit(event) {
		event.preventDefault();
		let title = this.state.title;
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;
		console.log(title,startDate,endDate);
		if (title) {
			this.props.onAddANewTask(title,startDate,endDate);
			this.setState({
				title: '',
        startDate: '',
        endDate: ''
			})
		}
	}
	// ----- functions ends

	render(){
		return(
			<form className="form" onSubmit={this.NewTaskSubmit.bind(this)}>
        <label>Enter Title:</label>
				<input
					type="text"
					onChange={this.ChangeANewTask.bind(this)}
					value={this.state.title}
				 /><br></br>
         <label>Enter Start Time:</label>
         <input 
           type="datetime-local"
           value={this.state.startDate}
           onChange={e => this.handleChange1('startDate', e)}
          /><br></br>
          <label>Enter End Time:</label>
         <input 
           type="datetime-local"
           value={this.state.endDate}
           onChange={e => this.handleChange1('endDate', e)}
          />
           
           <Button
					type='submit' className="submit-form"
				>ADD</Button>
			</form>
		)
	}
}

export default App;



