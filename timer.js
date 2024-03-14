class Timer {
    startTime = 0;

    start(){
        this.startTime = new Date().getTime();
    }

    lap(){
        const v = this.stop();
        this.start();
        return v;
    }

    stop(){
        return new Date().getTime() - this.startTime;
    }
}