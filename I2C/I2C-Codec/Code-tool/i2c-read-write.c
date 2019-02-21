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


const char *filename = "/dev/i2c-2";

int open_file(const char* filename)
{
    int ret;

    ret = open(filename, O_RDWR);
    if(ret != -1)
    {
	printf("Success open file ret=%d\n", ret);
    }
    else
    {
	printf("Failed open file ret=%d\n", ret);
    }
    return ret;
}

int read_one_byte_data_from_ak4613(int address)
{
    int data_read;
    return data_read;
}

int write_one_byte_data_to_ak4613(int address, char data)
{
    int ret;
    unsigned char reg_buff;
    ssize_t w = 0;
    ssize_t size = sizeof(unsigned char);

    //reg_buf = address &  0xFF;
    //if ((w = write(fd, reg_buf, size)) == -1)

    return ret;
}

int main(void)
{
    int slave_address = 0x10;
    int fd;
    char res_address = 0x70;
    char w_data = 0x12;
    char num;
    char *p = &num;
    ssize_t r = 0;
    ssize_t size = sizeof(char);
    void* buff_w;
    int res;
    buff_w = &res_address;
    //char w_data[2];
    //w_data[0] = 0x70;
    //w_data[1] = 0x80;
    //buff_w = wdata;    
    size = sizeof (char);
    fd = open_file(filename);
    // thay doi dia chi cua Slave
    if(ioctl(fd, I2C_SLAVE_FORCE, slave_address) == -1)
    {
	printf("Error\n");
    }
    
    write(fd, buff_w, size);

    //buff_w = &res_address;

    read(fd, p, size);

    

    //close(filename);
    union i2c_smbus_data data;
    struct i2c_smbus_ioctl_data args;
	__s32 err;
    args.read_write = I2C_SMBUS_WRITE;
	//args.command = command;
	args.size = size;
	args.data = data;

	err = ioctl(fd, I2C_SMBUS, &args);
	if (err == -1)

    printf("read data from slave is 0x%X\n", *p & 0xff);
    //res = i2c_smbus_write_byte_data(fd, res_address, w_data);
    char ch = 0x0C;
    printf("print ch=%x\n", ch);

    return 1;
}



