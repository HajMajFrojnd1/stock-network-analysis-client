class SimpleListener {

    constructor(){
        this.listeners = [];
    }

    addListener(listener) {
        if(listener instanceof Function){
            this.listeners.push(listener);
        }
    }

    fireEvent(...param){
        this.listeners.forEach((listener) => listener.apply(listener, param));
    }

    removeListener(listener){
        let index = this.listeners.indexOf(listener);
        if(index === -1){
            return false;
        }
        this.listeners.splice(index,1);
        return true;

    }

    cleanListeners(){
        this.listeners = [];
    }

    size(){
        return this.listeners.length;
    }

}

export default SimpleListener;