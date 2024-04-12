const inquirer = require('inquirer');
const consol = require('consola');
const consola = consol.withDefaults({
  colorMode: true
})

enum MessageVariant {
  Success = 'success',
  Error = 'error',
  Info = 'info'
}

class Message {
  constructor(private content: string) {}

  public show() {
    console.log(this.content);
  }

  public capitalize() {
    this.content = this.content[0].toUpperCase() + this.content.slice(1).toLowerCase();
  }

  public toLowerCase() {
    this.content = this.content.toLowerCase();
  }

  public toUpperCase() {
    this.content = this.content.toUpperCase();
  }

  static showColorized(status: MessageVariant, text: string) {
    consola[status](text);
  }
}

interface User {
  name: string;
  age: number;
}

class UsersData{
  private users: User[] = [];

  public showAll() {
    Message.showColorized(MessageVariant.Info, 'Users data:');
    if(this.users.length === 0) {
      Message.showColorized(MessageVariant.Error, 'No users found');
      return;
    } else {
      console.table(this.users);
    }
  }

  public add(user: User) {
    if(user.name.length > 0 && user.age > 0) {
      this.users.push(user);
      Message.showColorized(MessageVariant.Success, 'User added successfully');
    } else {
      Message.showColorized(MessageVariant.Error, 'Invalid user data');
    }
  }

  public remove(userName: string) {
    const userIndex = this.users.findIndex(user => user.name === userName);
    if(userIndex !== -1) {
      this.users.splice(userIndex, 1);
      Message.showColorized(MessageVariant.Success, 'User removed successfully');
    } else {
      Message.showColorized(MessageVariant.Error, 'User not found');
    }
  }

  public edit(userName: string ,user: User) {
    const userIndex = this.users.findIndex(user => user.name === userName);
    if(userIndex !== -1) {
      this.users.splice(userIndex, 1);
      this.users.push(user);
      Message.showColorized(MessageVariant.Success, 'User edited successfully');
    } else {
      Message.showColorized(MessageVariant.Error, 'User not found');
    }
  }

  public userExist(userName: string){
    const userIndex = this.users.findIndex(user => user.name === userName);
    if(userIndex !== -1) {
      return false;
    } else {
      return true;
    }
  }

}

const users = new UsersData();

console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

enum Action {
  List = 'list',
  Add = 'add',
  Remove = 'remove',
  Quit = 'quit',
  Edit = 'edit'
}

type InquirerAnswers ={
  action: Action
}

const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: InquirerAnswers) => {
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]);
        users.add(user);
        break;
      case Action.Edit:
        const userName = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        if(!users.userExist(userName.name)){
          const userEdit = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }, {
            name: 'age',
            type: 'number',
            message: 'Enter age',
          }]);
          users.edit(userName.name, userEdit);
        } else {
          
          Message.showColorized(MessageVariant.Error, 'User not found');
          break;
        }


        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        users.remove(name.name);
        break;
      case Action.Quit:
        Message.showColorized(MessageVariant.Info, "Bye bye!");
        process.exit(0);
      default:
        Message.showColorized(MessageVariant.Error, 'Command not found');
        break;
    }

    startApp();
  });
}

startApp();