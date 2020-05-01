import sys
print(sys.path)
import requests
import re
import bs4
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
 
def getHTMLText(url): #返回html文件資訊
     try:
         r = requests.get(url,timeout = 30)
         r.raise_for_status()
         r.encoding = r.apparent_encoding
         return r.text #返回html內容
     except:
         return ""
 
def fillHeroInformation(hlist,html): #將英雄資訊存入hlist列表
     soup = BeautifulSoup(html,"html.parser")
     for tr in soup.find(name = "tbody",attrs = "tabItem champion-trend-tier-SUPPORT").children: #遍歷上單tbody標籤的兒子標籤
         if isinstance(tr,bs4.element.Tag): #判斷tr是否為標籤型別，去除空行
             tds = tr('td') #查詢tr標籤下的td標籤
             heroName = tds[3].find(attrs = "champion-index-table__name").string #英雄名
             winRate = tds[4].string #勝率
             pickRate = tds[5].string #選取率
             hlist.append([heroName,winRate,pickRate]) #將英雄資訊新增到hlist列表中

def printHeroInformation(hlist): #輸出hlist列表資訊
     print("{:^20}\t{:^20}\t{:^20}\t{:^20}".format("英雄名","勝率","選取率","位置"))
     for i in range(len(hlist)):
         i = hlist[i]
         print("{:^20}\t{:^20}\t{:^20}\t{:^20}".format(i[0],i[1],i[2],"上單"))

def main():
     url = "http://www.op.gg/champion/statistics"
     hlist = []
     html = getHTMLText(url) #獲得html文件資訊
     fillHeroInformation(hlist,html) #將英雄資訊寫入hlist列表
     printHeroInformation(hlist) #輸出資訊
     test=pd.DataFrame(columns=["英雄名","勝率","選取率"],data=hlist)
     test["位置"]="輔助"
     print(test)
     test.to_csv("support.csv",encoding='UTF-8')
main()