function Person(name, foods){
    this.name = name;
    this.foods = foods;
}

//creating a function fetchFoods that will be called with each Person
Person.prototype.fetchFoods = function(){
    //Simulating an API
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(this.foods), 2000)
    })
}

describe('mocking', () => {
    it('mocks a regular function', () => {
        const fetchDogs = jest.fn();
        fetchDogs('snickers');
        expect(fetchDogs).toHaveBeenCalled();
        expect(fetchDogs).toBeCalledWith('snickers');
        fetchDogs('chewy')
        expect(fetchDogs).toHaveBeenCalledTimes(2)
    });

    it('can create a person', () => {
        const me = new Person('Jason', ['Sopes', 'Tostadas']);
        expect(me.name).toBe('Jason')
    })

    it('can fetch foods', async () => {
        const me = new Person('Jason', ['Sopes', 'Tostadas']);
        const favFoods = await me.fetchFoods();
        // console.log(favFoods);
        expect(favFoods).toContain('Sopes')
    })

    it('can mock favFoods and fetch foods', async () => {
        const me = new Person('Jason', ['Sopes', 'Tostadas']);
        //mock the favFoods function
        me.fetchFoods = jest.fn().mockResolvedValue(['Pizza', 'Hot Dogs'])
        const favFoods = await me.fetchFoods();
        // console.log(favFoods);
        expect(favFoods).toContain('Pizza')
    })
})