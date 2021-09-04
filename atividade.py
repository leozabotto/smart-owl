def numeros_primos(numero):
    for num in range(2,numero):
        if all(num%i!=0 for i in range(2,num)):
            print(num)