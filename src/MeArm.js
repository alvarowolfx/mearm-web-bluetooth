
const BS_SERIAL_SERVICE_UUID = 'd3e60000-8f36-40d6-b2d5-c5d9f5e81869';
const BS_SERIAL_RX_UUID = 'd3e60004-8f36-40d6-b2d5-c5d9f5e81869';
const BS_SERIAL_TX_UUID = 'd3e60005-8f36-40d6-b2d5-c5d9f5e81869';

const BLE_MODULE_NAME = "BlueShield";

export default class MeArm {	

	connect(){
		return navigator.bluetooth.requestDevice({
	      filters: [{
	        name: BLE_MODULE_NAME
	      }],
	      optionalServices: [
	        BS_SERIAL_SERVICE_UUID,
	        BS_SERIAL_TX_UUID,
	        BS_SERIAL_RX_UUID
	      ]
	    })
    	.then( device => device.gatt.connect() )
    	.then( server => {      
      		return server.getPrimaryService(BS_SERIAL_SERVICE_UUID);
    	})
    	.then( service => {
      		this.service = service;
      		service.getCharacteristic(BS_SERIAL_TX_UUID)
        		.then( tx => {
          			this.tx = tx;          
        		});
        	return true;
        })    
    	.catch( error => { 
      		console.log(error); 
      		return false;
    	});
	}

	updateArm(arm){
	  let { elbow, shoulder, base, gripper } = arm;
      let gripperData = gripper ? 1 : 0;
      let data = new Uint8Array([base, shoulder, elbow, gripperData]);
      //console.log(data);
      //console.log(this.state.arm);
      this.tx.writeValue(data);
	}

}