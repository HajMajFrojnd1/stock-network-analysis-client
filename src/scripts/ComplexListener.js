import SimpleListener from "./SImpleListener";

class ComplexListener {
    
    constructor(){
        this.listeners = {}
    }

    addListener(listener,event){
        if(!(event in this.listeners)){
            this.listeners[event] = new SimpleListener();
        }
        this.listeners[event].addListener(listener);
    }

    removeListener(listener,event){
        if(!(event in this.listeners)){
            return false;
        }

        if(this.listeners[event].removeListener(listener)){
            if(!(this.listeners[event].size())){
                delete this.listeners[event];
                return true;
            }
            return false;
        }

    }

    fireEvent(event,...params){
        if(event in this.listeners){
            this.listeners[event].fireEvent(params);
        }
    }

    cleanListeners(){
        this.listeners = {};
    }
}


export default ComplexListener;