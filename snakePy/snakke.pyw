"""import turtle 										v0
import time
from random import random
from math import sqrt
#DEFAULTS
SNAKE_COLOR = '#fff'
SNAKE_SHAPE = 'square'
BG_COLOR = '#172'
WIN_WIDTH = 800
WIN_HEIGHT = 600
BLOCK_SIZE = 22
FOOD_COLOR = 'yellow'
HITBOX = 10
FOOD_SHAPE = "turtle"
COLLITION_OFFSET = 1.2

#window
win = turtle.Screen()
win.title("snake game v1")
win.bgcolor(BG_COLOR)
win.setup(WIN_WIDTH,WIN_HEIGHT)
win.tracer(0)

#block
class block:
	def __init__(self):
		self.main = turtle.Turtle()
	def checkCollition(self, blockObject):
		if(sqrt((self.main.xcor() - blockObject.main.xcor())**2 + (self.main.ycor() - blockObject.main.ycor())**2) < BLOCK_SIZE*COLLITION_OFFSET):
			return True
		return False
#snake
class snakeBodyPart(block):
	def __init__(self, color):
		self.direction = "up"
		self.main = turtle.Turtle()
		self.main.shape(SNAKE_SHAPE)
		self.main.color(color)
		self.main.penup()
	def move(self, tmpDir):
		if(tmpDir == "up"):
			self.main.sety(self.main.ycor() + BLOCK_SIZE)
			self.direction = "up"
		if(tmpDir == "down"):
			self.main.sety(self.main.ycor() - BLOCK_SIZE)
			self.direction = "down"
		if(tmpDir == "left"):
			self.main.setx(self.main.xcor() - BLOCK_SIZE)
			self.direction = "left"
		if(tmpDir == "right"):
			self.main.setx(self.main.xcor() + BLOCK_SIZE)
			self.direction = "right"
class snake:
	def __init__(self, name, color = SNAKE_COLOR):
		self.body = [snakeBodyPart(color)]
		self.name = name
		self.color = color
	def grow(self):
		self.body.append(snakeBodyPart(self.color))
		if(self.body[-2].direction == "up"):
			self.body[-1].main.goto(self.body[-2].main.xcor(), self.body[-2].main.ycor()-BLOCK_SIZE)
		elif(self.body[-2].direction == "down"):
			self.body[-1].main.goto(self.body[-2].main.xcor(), self.body[-2].main.ycor()+BLOCK_SIZE)
		elif(self.body[-2].direction == "left"):
			self.body[-1].main.goto(self.body[-2].main.xcor()-BLOCK_SIZE, self.body[-2].main.ycor())
		elif(self.body[-2].direction == "right"):
			self.body[-1].main.goto(self.body[-2].main.xcor()+BLOCK_SIZE, self.body[-2].main.ycor())
		self.body[-1].direction = self.body[-2].direction
	def move(self, tmpDir):
		for i in range(len(self.body)-1, 0, -1):
			self.body[i].main.goto(self.body[i-1].main.xcor(), self.body[i-1].main.ycor())
			self.body[i].direction = self.body[i-1].direction
		self.body[0].move(tmpDir)
	def clear(self):
		for part in self.body:
			part.main.color(BG_COLOR)
			part.main.clear()


class food:
	def __init__(self, x = 50, y = 50, color = FOOD_COLOR):
		self.main = turtle.Turtle()
		self.main.penup()
		self.main.setx(x)
		self.main.sety(y)
		self.main.shape(FOOD_SHAPE)
		self.main.color(color)
	def changePos(self, x, y):
		self.main.setx(x)
		self.main.sety(y)

player = snake('ihab', 'red')
apple = food(20,20)
win.update()

def PLAYER_UP():
	player.move("up")
	player.body[0].direction = "up"
def PLAYER_DOWN():
	player.move("down")
	player.body[0].direction = "down"
def PLAYER_LEFT():
	player.move("left")
	player.body[0].direction = "left"
def PLAYER_RIGHT():
	player.move("right")
	player.body[0].direction = "right"
def randomApple():
	apple.main.goto(int((random()*WIN_HEIGHT//2-BLOCK_SIZE)%WIN_HEIGHT//2), int((random()*WIN_WIDTH//2)%WIN_WIDTH//2))
#event listener
win.listen()
win.onkeypress(PLAYER_UP,"Up")
win.onkeypress(PLAYER_DOWN,"Down")
win.onkeypress(PLAYER_LEFT,"Left")
win.onkeypress(PLAYER_RIGHT,"Right")
#Reset game

def reset():
	global player
	player.clear()
	player = snake('ihab','red')
win.onkeypress(reset,"r")
#main loop

while(1):
	player.move(player.body[0].direction)
	if(sqrt((player.body[0].main.xcor() - apple.main.xcor())**2 + (player.body[0].main.ycor() - apple.main.ycor())**2) < BLOCK_SIZE*COLLITION_OFFSET):
		player.grow()
		randomApple()
	time.sleep(0.1)
	win.update()"""

############ snake v 1 ##############
############ snake v 1 ##############
############ snake v 1 ##############
#MACROS
WIN_HEIGHT = 800
WIN_WIDTH = 600
SNAKE_SHAPE = 'square'
SNAKE_COLOR = 'red'
BG_COLOR = 'black'
FOOD_COLOR = 'yellow'
FOOD_SHAPE = 'circle'
BLOCK_SIZE = 22


import turtle
from math import sqrt
from time import sleep
from random import random

#screen
win = turtle.Screen()
win.setup(WIN_HEIGHT, WIN_WIDTH)
win.title("snake game v1.2")
win.bgcolor(BG_COLOR)
win.tracer(0.2)



class snakeBodyPart:
	def __init__(self, color = '#f00', direction = 'up'):
		self.main = turtle.Turtle()
		self.main.shape(SNAKE_SHAPE)
		self.main.color(color)
		self.direction = direction
		self.main.penup()
	def move(self):
		if(self.direction == 'up'):
				self.main.goto(self.main.xcor(), self.main.ycor()+BLOCK_SIZE)
		elif(self.direction == 'down'):
				self.main.goto(self.main.xcor(), self.main.ycor()-BLOCK_SIZE)
		elif(self.direction == 'left'):
				self.main.goto(self.main.xcor()-BLOCK_SIZE, self.main.ycor())
		elif(self.direction == 'right'):
				self.main.goto(self.main.xcor()+BLOCK_SIZE, self.main.ycor())


class snake:
	def __init__(self, color = SNAKE_COLOR):
		self.body = [snakeBodyPart(color)]
		self.color = color
	def grow(self):
		self.body.append(snakeBodyPart(self.color))
		if(self.body[-2].direction == 'up'):
			self.body[-1].main.goto(self.body[-2].main.xcor(), self.body[-2].main.ycor() - BLOCK_SIZE)
		elif(self.body[-2].direction == 'down'):
			self.body[-1].main.goto(self.body[-2].main.xcor(), self.body[-2].main.ycor() + BLOCK_SIZE)
		elif(self.body[-2].direction == 'left'):
			self.body[-1].main.goto(self.body[-2].main.xcor() - BLOCK_SIZE, self.body[-2].main.ycor())
		elif(self.body[-2].direction == 'up'):
			self.body[-1].main.goto(self.body[-2].main.xcor() + BLOCK_SIZE, self.body[-2].main.ycor())
	def move(self):
		for i in range(len(self.body)-1, 0, -1):
			self.body[i].main.goto(self.body[i-1].main.xcor(), self.body[i-1].main.ycor())
		self.body[0].move()



class food:
	def __init__(self, score = 1, color = FOOD_COLOR):
		self.score = score
		self.main = turtle.Turtle()
		self.main.penup()
		self.main.shape(FOOD_SHAPE)
		self.main.color(FOOD_COLOR)
		self.randomize()
	def randomize(self):
		randSeedX = int(random()*(WIN_HEIGHT - 50))
		randSeedY = int(random()*(WIN_WIDTH - 80))
		self.main.goto(randSeedX-WIN_HEIGHT//2, randSeedY-WIN_WIDTH//2)
		

player = snake()
point = food()
#movement handler
def MOV_UP():
		player.body[0].direction = "up"
def MOV_DOWN():
		player.body[0].direction = "down"
def MOV_LEFT():
		player.body[0].direction = "left"
def MOV_RIGHT():
		player.body[0].direction = "right"


#event handler
win.listen()
win.onkeypress(MOV_UP, "Up")
win.onkeypress(MOV_DOWN, "Down")
win.onkeypress(MOV_LEFT, "Left")
win.onkeypress(MOV_RIGHT, "Right")



#game main loop
while(1):
	player.move()
	if sqrt((player.body[0].main.xcor() - point.main.xcor())**2 + (player.body[0].main.ycor() - point.main.ycor())**2) < 15:
		point.randomize()
		player.grow()
	sleep(0.1)
	win.update() 


