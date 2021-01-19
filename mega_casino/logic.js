class User {
    constructor(name, money) 
    {
        if(money < 0)
        {
            console.error("Sum can`t be less than zero");
            money = 0;
        }
        this.money = money;
        this.name = name;
    }
  
    get money() {
      return this._money;
    }

    get name() {
        return this._name;
    }

    set money(value) {
      if (value < 0) {
        console.error("Sum can`t be less than zero");
        return;
      }
      this._money = value;
    }

    set name(value) {
        this._name = value;
    }

    play(sum, gameMachine)
    {
        if(sum <= this.money)
        {
            console.log(`Dear ${this.name}, your money before game: ${this.money}`)
            this.money -= sum;
            var profit = gameMachine.play(sum);
            this.money += profit;
            console.log(`Dear ${this.name}, your money after game: ${this.money}`);
        }
        else
            console.error(`Dear ${this.name}, you don\`t have enough money to play`);
    }
}


class GameMachine
{
    #money;
    constructor(number)
    {
        this.#money = number;
    }
    get getMoney(){
        return this.#money;
    }
    takeMoneyFrom(number)
    {
        if(number > 0)
        {
            if(this.#money >= number)
            {
                this.#money -= number;
                console.log(`(Taking) Balance: ${this.#money}`)
            } 
            else
                console.error("No so much money");
        }
        else
            console.error("Sum can`t be less than zero");
    }
    giveMoneyTo(number)
    {
        if(number > 0)
        {
            this.#money += number;
            console.log(`(Giving) Balance: ${this.#money}`)
        }       
        else
            console.error("Sum can`t be less than zero");
    }
    play(sum)
    {
        if(sum > 0)
        {
            this.#money += sum;
            var number = Math.floor(Math.random() * (999 - 100) ) + 100;
            console.log(`The number is: ${number}`);

            var digits = number.toString().split('');
            var realDigits = digits.map(Number)

            var numberOfSameDigits = 0;
            var found = false;

            for(var i = 0 ; i <realDigits.length;i++){
                for(var j = 0; j < realDigits.length; j++){
                    if(realDigits[i] === realDigits[j] && i != j){
                        if(!found){
                            numberOfSameDigits++;
                            found = true;
                        }
                    }
                }
                found = false;
            }
            
            switch(numberOfSameDigits)
            {
                case 2:
                    if(this.#money < 0)
                    {
                        console.error("Sorry, we don`t have money");
                        return 0;
                    }
                    this.#money -= (sum*2);
                    return sum*2;
                case 3:
                    if(this.#money < 0)
                    {
                        console.error("Sorry, we don`t have money");
                        return 0;
                    }
                    this.#money -= (sum*3);
                    return sum*3;
            }
            return 0;
        }
    }
}

class Casino
{
    #name;
    #machines;
    constructor(name)
    {
        this.#name = name;
        this.#machines = [];
    }
    addGameMachine(machine)
    {
        this.#machines.push(machine);
    }
    getMachine(i) {
        return this.#machines[i];
    }
    get getName(){
        return this.#name;
    }
    get getMachineCount(){
        return this.#machines.length;
    }
    sortMachines(){
        this.#machines.sort(function(a, b){return b.getMoney - a.getMoney});
    }
    get getMoney(){
        let sum = 0;
        this.#machines.forEach(el => sum += el.getMoney);
        return sum;
    }
    get getMachines(){
        return this.#machines;
    }
    deleteMachine(i)
    {
        if(i > this.#machines.length - 1)
        {
            console.error("There isn`t such machine");
            return;
        }
        this.#machines.splice(i, 1);
    }
}

class SuperAdmin extends User
{
    #casinos;
    constructor(name, money)
    {
        super(name, money);
        this.#casinos = [];
    }
    get getCasinos(){
        return this.#casinos;
    }
    createCasino(casinoName)
    {
        this.#casinos.push(new Casino(casinoName));
        console.log(`Casino ${casinoName} created`);
    }
    createGameMachine(i, number)
    {
        if(this.money >= number)
        {
            this.money -= number;
            this.#casinos[i].addGameMachine(new GameMachine(number));
            console.log(`Game Machine with ${number} created, owner balance: ${this.money}`);
        }
        else
        {
            console.error("You don`t have enough money to create Game Machine");
        }
    }
    takeMoneyFromCasino(i, sum)
    {
        if( sum > this.#casinos[i].getMoney)
        {
            console.error(`It isn\`t enough money in ${this.#casinos[i].getName}, now ${this.#casinos[i].getMoney}`);
            return;
        }
        var sumCopy = sum;
        this.#casinos[i].sortMachines();
        var j;
        for( j = 0; j<this.#casinos[i].getMachineCount; j++)
        {
            if(sum > 0)
            {
                if(this.#casinos[i].getMachine(j).getMoney < sum)
                {
                    sum -= this.#casinos[i].getMachine(j).getMoney;
                    this.#casinos[i].getMachine(j).takeMoneyFrom(this.#casinos[i].getMachine(j).getMoney);    
                }
                else
                {
                    this.#casinos[i].getMachine(j).takeMoneyFrom(sum);
                    sum = 0;
                }
            }
            else
                break;
        }
        console.log(`${sumCopy} was taken from ${this.#casinos[i].getName}, balance: ${this.#casinos[i].getMoney}`);
        this.money = this.money + sumCopy;
        console.log(`Admin balance aftre taking money ${this.money}`);
        return sumCopy;
    }
    addMoneyToGameMachine(iCasino, iGameMachine, money)
    {
        this.#casinos[iCasino].getMachine(iGameMachine).giveMoneyTo(money);
    }
    deleteGameMachine(iCasino, iGameMachine)
    {
        if(iCasino > this.#casinos.length - 1)
        {
            console.error("There isn`t such casino");
            return;
        }
        if(iGameMachine > this.#casinos[iCasino].getMachineCount - 1)
        {
            console.error("There isn`t such machine");
            return;
        }
        var sum = this.#casinos[iCasino].getMachine(iGameMachine).getMoney;
        this.#casinos[iCasino].deleteMachine(iGameMachine);
        var sumToAddEach = sum / this.#casinos[iCasino].getMachineCount;
        this.#casinos[iCasino].getMachines.forEach(e => e.giveMoneyTo(sumToAddEach));
    }
}


var superAdmin = new SuperAdmin("Andre", 12000);

superAdmin.createCasino("Lotto");
superAdmin.createGameMachine(0, 4500);
superAdmin.createGameMachine(0, 3000);

var user1 = new User("Olia", 13000);
var user2 = new User("Lida", 13000);

user1.play(100, superAdmin.getCasinos[0].getMachines[0]);
user1.play(100, superAdmin.getCasinos[0].getMachines[1]);
user1.play(100, superAdmin.getCasinos[0].getMachines[0]);
user1.play(100, superAdmin.getCasinos[0].getMachines[0]);
user1.play(100, superAdmin.getCasinos[0].getMachines[0]);
user1.play(100, superAdmin.getCasinos[0].getMachines[1]);
user1.play(100, superAdmin.getCasinos[0].getMachines[0]);

user2.play(100, superAdmin.getCasinos[0].getMachines[0]);
user2.play(100, superAdmin.getCasinos[0].getMachines[0]);
user2.play(100, superAdmin.getCasinos[0].getMachines[1]);
user2.play(100, superAdmin.getCasinos[0].getMachines[0]);
user2.play(100, superAdmin.getCasinos[0].getMachines[1]);
user2.play(100, superAdmin.getCasinos[0].getMachines[0]);
user2.play(100, superAdmin.getCasinos[0].getMachines[1]);

superAdmin.takeMoneyFromCasino(0, 6000);


