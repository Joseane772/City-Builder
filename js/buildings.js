import * as THREE from 'three'

export default{
    'residential': () => {
        return {
            id : 'residential',
            height: 1,
            updated: true,
            update: function() {
                if(Math.random()< 0.1){
                    if(this.height < 5){
                        this.height += 1;
                        this.updated = true;
                    }
                }
            }
        }
    },
    'comercial': () => {
        return {
            id : 'comercial',
            height: 1,
            updated: true,
            update: function() {
                if(Math.random()< 0.1){
                    if(this.height < 5){
                        this.height += 1;
                        this.updated = true;
                    }
                }

            }
        }
    },
    'industrial': () => {
        return {
            id : 'industrial',
            height: 1,
            updated: true,
            update: function() {
                if(Math.random()< 0.1){
                    if(this.height < 5){
                        this.height += 1;
                        this.updated = true;
                    }
                }

            }
        }
    },
    'road': () => {
        return {
            id : 'road',
            updated: true,
            update: function() {
                this.updated = false;
            }
        }
    }

}