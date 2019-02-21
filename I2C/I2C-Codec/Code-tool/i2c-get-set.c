#include <sys/ioctl.h>
#include <sys/fcntl.h>
#include <errno.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <linux/i2c.h>
#include <linux/i2c-dev.h>
#include "smbus.h"
#include "i2cbusses.h"
#include "util.h"
#include <errno.h>
#include <sys/types.h>
#include <sys/stat.h>


int init(void)
{
int file, res, daddress, i2cbus, address;
int adapter_nr = 2; /* probably dynamically determined */
int force = 1;
char filename[20];
char filename_2[20];
//snprintf(filename, 19, "/dev/i2c-%d", adapter_nr);

const char* i2c_data = "2";

//printf("i2c = %s\n", filename);


int addr = 0x10;          // The I2C address of the ADC

address = addr;

printf("add 0x%x\n add=%d ", addr, addr);

i2cbus = lookup_i2c_bus(i2c_data);

	printf("i2cbus=%d\n", i2cbus);
	printf("str=%s\n",i2c_data );


file = open_i2c_dev(i2cbus, filename_2, sizeof(filename_2), 0);

	printf("Hoan filename=%s\n",filename_2 );
	file = open_i2c_dev(i2cbus, filename_2, sizeof(filename_2), 0);


set_slave_addr(file, addr, force);

daddress = 0x06;
res = i2c_smbus_read_byte_data(file, daddress);

close(file);

printf("res=%d\n", res);


return 0;

}




int main(void)
{
	init();



return 1;
}



