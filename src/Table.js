import React, {useState} from 'react';
import DataService from './DataService';

class Table extends React.Component{
    constructor(props){
        super(props);

        this.addRow = this.addRow.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkDisabled = this.checkDisabled.bind(this);
        this.saveResults = this.saveResults.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.state = {
            users : [{id : 1, name : 'Pavel', salary : 20000},{id : 2, name : 'Pavel2', salary : 40000}]
        };
        this.arr = true;
    }

    fetchGetAll() {
        DataService.getAll()
            .then(res => {
            return res.json()
            })
            .then(data => {
            this.setState({
                users: data
            })
        })
    }

    componentDidMount(){
        this.fetchGetAll();
    }

    addRow(){
        if(!this.arr)return;
        this.arr = !this.arr;
        this.setState((state,props) => {
            state.users.push({});
            return {
                users : state.users
            }
        })
    }

    handleChange(evt){
        let id = evt.target.getAttribute('data-id');
        let field = evt.target.name;
        // let fields = field.split('.');
        let value = evt.target.value;

        this.setState((state,props) => {
            let users = state.users;
            let foundUser = users.find(us => us.id == id);
            foundUser[field] = value;
            foundUser['touched'] = (foundUser.name && foundUser.salary) ? true : false;
            // users.splice(index,1,{id : id, n})
            return {
                users : state.users
            }
        })
    }

    checkDisabled(user){
        if(user.id == 0)return true;
        return user.name && user.id;

    }

    deleteAll(){
        DataService.deleteAll()
    }

    saveResults(user){
        let salary = {
            value : parseInt(user.salary)
        };
        user['salary'] = salary;
        if(user.id == undefined){
            DataService.addUser(user)
                .then(data => {
                    console.log(data);
                    this.arr = !this.arr;
                    this.setState((state,props) => {
                        let users = state.users;
                        let foundUser = users.find(us => us.id == undefined);
                        foundUser.id = data.id;
                        foundUser.touched = false;
                        return {
                            users : users
                        }
                    })
                })
        }
        else{
            DataService.modifyUser(user)
                .then(data => {
                    console.log(data);
                    this.setState((state,props) => {
                        let users = state.users;
                        let foundUser = users.find(us => us.id == data.id);
                        foundUser.touched = false;
                        return {
                            users : users
                        }
                    })
                })
        }

    }

    render(){
        return(
            <div className="table-responsive">
                <table id="t" className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col" className="idColumn" current-data-sort-order="asc">Id<i class="glyphicon glyphicon-arrow-up"></i></th>
                        <th scope="col">Name</th>
                        <th scope="col">Salary</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map((user,ind) => {
                       return <tr key={user.id}>
                           <th scope="row">{ind}</th>
                           {/*<td className="idColumn">{user.id}</td>*/}
                           <td><input className={this.checkDisabled(user) ? 'disabledInput' : ''} name="name" data-id={user.id} type="text" value={user.name} disabled={this.checkDisabled(user)}
                                      onChange={this.handleChange}/></td>
                           <td><input name="salary" data-id={user.id} type="number"
                                      value={user.salary ? user.salary.value ? user.salary.value : user.salary : 0} onChange={this.handleChange}/></td>
                               {user.touched ? <td className="saveRow" onClick={this.saveResults.bind(this,user)}><i className="save-cell glyphicon glyphicon-ok"></i></td> : ''}
                        </tr>
                    })}
                    </tbody>
                </table>
                <p className="left">Add<i aria-disabled={!this.arr} class="add-laf-table-row glyphicon glyphicon-plus" onClick={this.addRow}></i></p>
                <div className="deletebtn"><button className="btn btn-danger" onClick={this.deleteAll}>Delete all</button></div>

            </div>
        );
    }
}


export default Table