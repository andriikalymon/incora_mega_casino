class User {
    constructor(name, money) 
    {
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
        console.error("Incorrect sum");
        return;
      }
      this._money = value;
    }

    set name(value) {
        this._name = value;
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
                console.log("(Taking) Balance: " + this.#money)
            } 
            else
                console.error("No so much money");
        }
        
    }
    giveMoneyTo(number)
    {
        if(number > 0)
        {
            this.#money += number;
            console.log("(Giving) Balance: " + this.#money)
        }       
    }
    play(sum)
    {
        if(sum > 0)
        {
            this.#money += sum;
            var number = Math.floor(Math.random() * (999 - 100) ) + 100;

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
        this.#machines.forEach(el => sum+=el.getMoney);
        return sum;
    }
    get getMachines(){
        return this.#machines;
    }
    deleteMachine(i)
    {
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
    }
    createGameMachine(i, number)
    {
        this.#casinos[i].addGameMachine(new GameMachine(number));
    }
    takeMoneyFromCasino(i, sum)
    {
        if( sum > this.#casinos[i].getMoney)
        {
            console.log("It isn`t enough money");
            return;
        }
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
        return sum;
    }
    addMoneyToGameMachine(iCasino, iGameMachine, money)
    {
        this.#casinos[iCasino].getMachine(iGameMachine).giveMoneyTo(money);
    }
    deleteGameMachine(iCasino, iGameMachine)
    {
        var sum = this.#casinos[iCasino].getMachine(iGameMachine).getMoney;
        this.#casinos[iCasino].deleteMachine(iGameMachine);
        var sumToAddEach = sum / this.#casinos[iCasino].getMachineCount;
        this.#casinos[iCasino].getMachines.forEach(e => e.giveMoneyTo(sumToAddEach));
    }
}